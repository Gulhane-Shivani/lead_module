import sys
sys.path.append('d:\\future invo solution\\lead_module\\backend')
from app.schemas.lead import LeadCreate
from pydantic import ValidationError

try:
    LeadCreate(**{
        'full_name': 'Unknown Lead',
        'email': None,
        'phone': None,
        'status': 'New',
        'form_id': 1,
        'dynamic_fields': [{'field_id': 1, 'value': 'Bachelors'}]
    })
    print('Success')
except ValidationError as e:
    print(e)
