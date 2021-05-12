import os

if os.system('pm2 pid "randomAcro"'):
    os.system('pm2 restart "randomAcro"')
else:
    os.system('pm2 start "randomAcro"')