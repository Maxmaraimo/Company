
def game(secret_num):
    times = 0
    while True:
        guess = int(input("Enter a number please: "))
        times += 1
        
        att = "attempts"
        if times == 1:
            att = "attempt"

        if guess > secret_num:
            if guess == secret_num + 1:
                print("Too close, a little below than that...")
            else:
                print("Too high...")
            continue
        elif guess < secret_num:
            if guess == secret_num - 1:
                print("Too close, a little higher than that...")
            else:
                print("Too below...")
            continue
        else:
            print(f"It took you {times} {att} in total...")
            break