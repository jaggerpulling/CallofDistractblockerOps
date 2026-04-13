from block import *

group_name = "Default"

def header():
    print("Welcome to the Distraction Blocker CLI Demo!")

    

def main():
    header()
    print("1. Enable block")
    print("3. add Items")
    print("4. Add group")
    print("9. Exit")
    while True:
        choice = input(f"Select an option: ")
        if choice == "1":
            set_group_enabled(group_name, True)
            print("Block enabled.")
        elif choice == "4":
            create_group("API Group", "Demo created with CLI")
        elif choice == "3":
            item = input("Enter the item to block: ")
            blocklist_add(item, group_name, comment=None)
            print(f"{item} added to blocklist.")
        elif choice == "5":
            status = get_blocking_status(group_name)
            print(f"Blocking status: {'Enabled' if status else 'Disabled'}")
        elif choice == "9":
            print("Exiting...")
        else:
            print("Invalid option.")

main()