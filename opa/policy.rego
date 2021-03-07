package policy

import data.requests
import data.permissions
import data.subscriptions

default allow = false

allow {
    check_policy[input]
}

check_policy[input] {
    r = requests[_]
    some i; match_with_wildcard(permissions, input.permissions[i])
    some j; match_with_wildcard(subscriptions, input.subscriptions[j])
    match_with_wildcard(r.methods, input.method)
    match_with_wildcard(r.resources, input.resource)
}

match_with_wildcard(allowed, value) {
    allowed[_] = "*"
}
match_with_wildcard(allowed, value) {
    allowed[_] = value
}
