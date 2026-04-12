import requests

BASE_URL = "http://192.168.86.26/api"
PASSWORD = "fuck u"

# login and get session ID
def start_session():
    res = requests.post(f"{BASE_URL}/auth",
        json={"password": PASSWORD}
    )
    print("Status:", res.status_code)
    print("Response:", res.text)
    data = res.json()
    return data["session"]["sid"]
    
sid = start_session()
headers = {"X-FTL-SID": sid}

def create_group(name, description):
    res = requests.get(f"{BASE_URL}/groups", headers=headers)
    data = res.json()
    current_groups = [group["name"] for group in data["groups"]]

    if name.lower() in current_groups.lower(): #check if group exists
        print("invalid, group already exists")
    else:
        res = requests.post(f"{BASE_URL}/groups{name}",
        json={"name": name, "enabled": False, "comment": description},
        headers=headers)
        if res.status_code == 200:
            print("group created!")
        else:
            print("bad", res.status_code)







