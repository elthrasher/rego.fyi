package main

import (
	"encoding/base64"
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

var (
	response events.APIGatewayCustomAuthorizerResponse
	request  events.APIGatewayCustomAuthorizerRequestTypeRequest
	err      error
)

func TestHandler(t *testing.T) {

	tokenString := `{"data":"{\"requests\":[{\"methods\":[\"GET\"],\"resources\":[\"/orders\"]}],\"permissions\":[\"start_order\",\"view_invoice\"],\"subscriptions\":[\"newsletter\"]}","rego":"package policy\n\nimport data.requests\nimport data.permissions\nimport data.subscriptions\n\ndefault allow = false\n\nallow {\n    check_policy[input]\n}\n\ncheck_policy[input] {\n    r = requests[_]\n    some i; match_with_wildcard(data.permissions, input.permissions[i])\n    some j; match_with_wildcard(data.subscriptions, input.subscriptions[j])\n    match_with_wildcard(r.methods, input.method)\n    match_with_wildcard(r.resources, input.resource)\n}\n\nmatch_with_wildcard(allowed, value) {\n    allowed[_] = \"*\"\n}\nmatch_with_wildcard(allowed, value) {\n    allowed[_] = value\n}","token":"{\"permissions\":[\"start_order\"],\"resource\":\"/orders\",\"method\":\"GET\",\"subscriptions\":[\"newsletter\"]}"}`

	encodedtoken := base64.StdEncoding.EncodeToString([]byte(tokenString))

	request = events.APIGatewayCustomAuthorizerRequestTypeRequest{
		Headers:    map[string]string{"Authorization": "Bearer " + encodedtoken},
		HTTPMethod: "GET",
		MethodArn:  "testARN",
		Path:       "/orders",
	}
	got, err := Handler(request)
	if err != nil {
		t.Errorf("Error: %s\n", err)
	}

	if got.PolicyDocument.Statement[0].Effect != "Allow" {
		t.Errorf("Invalid policy returned: %s\n", got)
	}

}
