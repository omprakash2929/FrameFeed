import urllib.request
import urllib.parse
import json
import uuid

# create dummy file
with open("test.mp4", "wb") as f:
    f.write(b"dummy")

import mimetypes
from email.message import EmailMessage

boundary = uuid.uuid4().hex
body = []

# file part
body.append(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.mp4"\r\nContent-Type: video/mp4\r\n\r\ndummy\r\n'.encode('utf-8'))

# fields
for k, v in {'fps': '1.0', 'max_frames': '10', 'quality': 'medium', 'orientation': 'landscape'}.items():
    body.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode('utf-8'))

body.append(f'--{boundary}--\r\n'.encode('utf-8'))
data = b''.join(body)

req = urllib.request.Request("http://localhost:8000/api/convert", data=data, headers={'Content-Type': f'multipart/form-data; boundary={boundary}'})
try:
    res = urllib.request.urlopen(req)
    print(res.read())
except Exception as e:
    print(e)
