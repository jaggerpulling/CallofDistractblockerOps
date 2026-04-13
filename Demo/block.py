import requests

BASE_URL = "http://192.168.86.26/api"
PASSWORD = "hJoKCXwu"

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
    -pass strings!
"""
def create_group(name, description):
    res = requests.get(f"{BASE_URL}/groups/", headers=headers)
    data = res.json()
    current_groups = [group["name"].lower() for group in data["groups"]]

    if name.lower() in current_groups:
        print("invalid, group already exists")
    else:
        res = requests.post(f"{BASE_URL}/groups",
            json={"name": name, "enabled": False, "comment": f"API GROUP: {description}"},
            headers=headers
        )
        if res.status_code == 201:
            print("group created!")
        else:
            print("bad", res.status_code, res.text)

def get_group_id(name):
    res = requests.get(f"{BASE_URL}/groups/", headers=headers)
    groups = res.json()["groups"]
    for group in groups:
        if group["name"] == name:
            return group["id"]
    return None

def blocklist_add(domain, group_name, comment=None):
    group_id = get_group_id(group_name)
    wildcard = f"(^|\\.){domain}$"
    res = requests.post(f"{BASE_URL}/domains/deny/regex",
        json={
            "domain": wildcard,
            "comment": comment,
            "groups": [group_id],
            "enabled": True
        },
        headers=headers
    )
    # Update Gravity so changes persist
    requests.post(f"{BASE_URL}/action/gravity", headers=headers)
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







