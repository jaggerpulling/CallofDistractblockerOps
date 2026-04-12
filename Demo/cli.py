def header():
    print("Welcome to the Distraction Blocker CLI Demo!")

def block():

def view_blocked_items():
    for item in blocklist:
        print(item)

def main():
    header()
    choice = input(f"Select an option: ")
    print("1. Enable block")
    print("3. View blocked items")
    print("4. Exit")
    while True:
        if choice == "1":
            print("Block enabled.")
        elif choice == "3":
            print("Enter 1 to add a new item, or 2 to remove an item.")
            subchoice = input("Enter your choice: ")
            if subchoice == "1":
                item = input("Enter the item to block: ")
                blocklist.append(item)
                print(f"{item} added to blocklist.")
            elif subchoice == "2":
                item = input("Enter the item to unblock: ")
                if item in blocklist:
                    blocklist.remove(item)
                    print(f"{item} removed from blocklist.")
                else:
                    print(f"{item} is not in the blocklist.")

        elif choice == "4":
            print("Exiting...")
        else:
            print("Invalid option.")
