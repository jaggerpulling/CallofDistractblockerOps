import requests

BASE_URL = "http://192.168.86.26/api"
PASSWORD = ""

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




"""
Create Group with custom NAME & DESCRIPTION
"""
def create_group(name, description):
    res = requests.get(f"{BASE_URL}/groups", headers=headers)
    data = res.json()
    current_groups = [group["name"] for group in data["groups"]]

    if name.lower() in current_groups.lower(): #check if group exists
        print("invalid, group already exists")
    else:
        res = requests.post(f"{BASE_URL}/groups{name}",
        json={"name": name, "enabled": False, "comment": (f"API GROUP: {description}")},
        headers=headers)
        if res.status_code == 200:
            print("group created!")
        else:
            print("bad", res.status_code)

def get_group_id(name):
    res = requests.get(f"{BASE_URL}/groups/", headers=headers)
    groups = res.json()["groups"]
    for group in groups:
        if group["name"] == name:
            return group["id"]
    return None

def blocklist_add(domain, group_name, comment=None):
    group_id = get_group_id(group_name)
    res = requests.post(f"{BASE_URL}/domains/deny/exact",
        json={
            "domain": domain,
            "comment": comment,
            "groups": [group_id],
            "enabled": True
        },
        headers=headers
    )
    return res.json()

def get_blocking_status(group_name):
    res = requests.get(f"{BASE_URL}/groups/{group_name}",
            headers=headers)
    return res.json()["groups"][0]["enabled"]

def set_group_enabled(group_name, enabled: bool):
    res = requests.put(f"{BASE_URL}/groups/{group_name}",
        json={"enabled": enabled},
        headers=headers
    )
    return res.json()







