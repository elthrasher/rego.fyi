package main

import (
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

var (
	response events.APIGatewayCustomAuthorizerResponse
	request  events.APIGatewayCustomAuthorizerRequestTypeRequest
	err      error
)

func TestHandler(t *testing.T) {
	request = events.APIGatewayCustomAuthorizerRequestTypeRequest{
		Headers:    map[string]string{"Authorization": "Bearer eyJkYXRhIjoie1wicmVxdWVzdHNcIjpbe1wibWV0aG9kc1wiOltcIkdFVFwiXSxcInJlc291cmNlc1wiOltcIi9vcmRlcnNcIl19XSxcInBlcm1pc3Npb25zXCI6W1wic3RhcnRfb3JkZXJcIixcInZpZXdfaW52b2ljZVwiXSxcInN1YnNjcmlwdGlvbnNcIjpbXCJuZXdzbGV0dGVyXCJdfSIsInJlZ28iOiJwYWNrYWdlIGVudGl0bGVtZW50c1xuXG5pbXBvcnQgZGF0YS5yZXF1ZXN0c1xuaW1wb3J0IGRhdGEucGVybWlzc2lvbnNcbmltcG9ydCBkYXRhLnN1YnNjcmlwdGlvbnNcblxuZGVmYXVsdCBhbGxvdyA9IGZhbHNlXG5cbmFsbG93IHtcbiAgICBjaGVja19lbnRpdGxlbWVudHNbaW5wdXRdXG59XG5cbmNoZWNrX2VudGl0bGVtZW50c1tpbnB1dF0ge1xuICAgIHIgPSByZXF1ZXN0c1tfXVxuICAgIHNvbWUgaTsgbWF0Y2hfd2l0aF93aWxkY2FyZChkYXRhLnBlcm1pc3Npb25zLCBpbnB1dC5wZXJtaXNzaW9uc1tpXSlcbiAgICBzb21lIGo7IG1hdGNoX3dpdGhfd2lsZGNhcmQoZGF0YS5zdWJzY3JpcHRpb25zLCBpbnB1dC5zdWJzY3JpcHRpb25zW2pdKVxuICAgIG1hdGNoX3dpdGhfd2lsZGNhcmQoci5tZXRob2RzLCBpbnB1dC5tZXRob2QpXG4gICAgbWF0Y2hfd2l0aF93aWxkY2FyZChyLnJlc291cmNlcywgaW5wdXQucmVzb3VyY2UpXG59XG5cbm1hdGNoX3dpdGhfd2lsZGNhcmQoYWxsb3dlZCwgdmFsdWUpIHtcbiAgICBhbGxvd2VkW19dID0gXCIqXCJcbn1cbm1hdGNoX3dpdGhfd2lsZGNhcmQoYWxsb3dlZCwgdmFsdWUpIHtcbiAgICBhbGxvd2VkW19dID0gdmFsdWVcbn0iLCJ0b2tlbiI6IntcInBlcm1pc3Npb25zXCI6W1wic3RhcnRfb3JkZXJcIl0sXCJyZXNvdXJjZVwiOlwiL29yZGVyc1wiLFwibWV0aG9kXCI6XCJHRVRcIixcInN1YnNjcmlwdGlvbnNcIjpbXCJuZXdzbGV0dGVyXCJdfSJ9"},
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
