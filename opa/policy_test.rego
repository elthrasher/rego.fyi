package policy

test_get_allowed {
    allow with input as {"permissions":["start_order"], "resource": "/orders", "method":"GET", "subscriptions":["newsletter"]}
}

test_get_wrong_subcription_denied {
    not allow with input as {"permissions":["start_order"], "resource": "/orders", "method":"GET", "subscriptions":["pizza_of_the_month"]}
}

test_get_wrong_permission_denied {
    not allow with input as {"permissions":["change_password"], "resource": "/orders", "method":"GET", "subscriptions":["newsletter"]}
}
