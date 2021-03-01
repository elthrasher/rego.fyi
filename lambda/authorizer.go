package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"strings"

	"fmt"
	"log"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/open-policy-agent/opa/ast"
	"github.com/open-policy-agent/opa/rego"
	"github.com/open-policy-agent/opa/storage"
	"github.com/open-policy-agent/opa/storage/inmem"
	"github.com/open-policy-agent/opa/util"
)

var module string
var store storage.Store
var compiler *ast.Compiler
var ctx context.Context

func main() {
	log.Println("cold start")

	// just compile OPA policies once per container

	//os.Exit(0)
	lambda.Start(Handler)
}

func track(start time.Time, name string) {
	elapsed := time.Since(start)
	log.Printf("%s took %s", name, elapsed)
}

func compileOpaPolicy(module string, data string) {
	defer track(time.Now(), "compileOpaPolicy()")

	ctx = context.Background()

	store = inmem.NewFromReader(bytes.NewBufferString(data))

	// Parse the module. The first argument is used as an identifier in error messages.
	parsed, err := ast.ParseModule("entitlements.rego", module)
	if err != nil {
		// Handle error.
	}

	// Create a new compiler and compile the module. The keys are used as
	// identifiers in error messages.
	compiler = ast.NewCompiler()
	compiler.Compile(map[string]*ast.Module{
		"entitlements.rego": parsed,
	})

	if compiler.Failed() {
		// Handle error. Compilation errors are stored on the compiler.
		panic(compiler.Errors)
	}
}

func checkOpaPolicy(method string, permissions []string, resourcePath string, subscriptions []string) (result bool) {
	defer track(time.Now(), "checkOpaPolicy()")

	// Create a new query that uses the compiled policy from above.
	reg := rego.New(
		rego.Query("data.entitlements.allow"),
		rego.Store(store),
		rego.Compiler(compiler),
		rego.Input(
			map[string]interface{}{
				"method":        method,
				"permissions":   permissions,
				"resource":      resourcePath,
				"subscriptions": subscriptions,
			},
		),
	)

	// Run evaluation.
	rs, err := reg.Eval(ctx)

	if err != nil {
		log.Println("err:", err)
	}

	if len(rs) != 1 {
		return false
	}

	result = util.Compare(rs[0].Expressions[0].Value, true) == 0

	return result

}

// Handler is the stuff
func Handler(event events.APIGatewayCustomAuthorizerRequestTypeRequest) (events.APIGatewayCustomAuthorizerResponse, error) {
	defer track(time.Now(), "Handler()")
	log.Println("handle event")

	/**
	check Authorization header first - just using 'allow' and 'deny' value to simulate for now
	JWT validation can replace this to check signing/exp, and then auth caching can be enabled in apigw
	*/
	rawToken := strings.ReplaceAll(event.Headers["Authorization"], "Bearer ", "")

	decodedStr, err := base64.StdEncoding.DecodeString(rawToken)
	if err != nil {
		fmt.Printf("failed to parse payload: %s\n", err)
	}

	var dat map[string]string

	if err := json.Unmarshal(decodedStr, &dat); err != nil {
		fmt.Printf("Could not deserialize json: %s\n", err)
	}

	var token map[string][]string

	json.Unmarshal([]byte(dat["token"]), &token)

	compileOpaPolicy(dat["rego"], dat["data"])

	resourcePath := event.Path
	if checkOpaPolicy(event.HTTPMethod, token["permissions"], resourcePath, token["subscriptions"]) {
		log.Println("OPA policy check ok - request allowed")
		return generateIAMPolicy("user", "Allow", event.MethodArn), nil
	}
	log.Println("failed OPA policy check")
	return generateIAMPolicy("user", "Deny", event.MethodArn), nil

}

/**
Generate IAM policy document
*/
func generateIAMPolicy(principalID string, effect string, resource string) events.APIGatewayCustomAuthorizerResponse {
	defer track(time.Now(), "generateIAMPolicy()")
	authResponse := events.APIGatewayCustomAuthorizerResponse{PrincipalID: principalID}

	if effect != "" && resource != "" {
		authResponse.PolicyDocument = events.APIGatewayCustomAuthorizerPolicy{
			Version: "2012-10-17",
			Statement: []events.IAMPolicyStatement{
				{
					Action:   []string{"execute-api:Invoke"},
					Effect:   effect,
					Resource: []string{resource},
				},
			},
		}
	}

	authResponse.Context = map[string]interface{}{}
	return authResponse
}
