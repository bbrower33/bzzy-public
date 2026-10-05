# Powershell script that starts the localhost server for 
# ease of development.
#
# Brian Brower
# 10/05/2026
# 2026 © Bzzy

Set-Location .;
Start-Process "http://localhost:8080";
python -m http.server 8080 --bind 127.0.0.1;