import urllib.request
import json
import urllib.error

data = {
    'full_name': 'Unknown Lead',
    'email': None,
    'phone': None,
    'status': 'New',
    'form_id': 1,
    'dynamic_fields': [{'field_id': 1, 'value': 'Bachelors'}]
}

# The frontend interceptor adds Authorization Bearer token, we need a valid token to bypass 401
# Since we don't easily have a token, maybe we can just read the server logs directly?
