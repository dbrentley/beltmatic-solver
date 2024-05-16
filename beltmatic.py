from collections import deque

"""
Beltmatic Optimizer
Author: Brent Douglas (https://github.com/dbrentley)

Edit the two variables "max_number" and "target". max_number is the 
highest number you have unlocked and target is the target you are trying 
to reach.
"""
# User inputs
# Maximum (highest) number you have unlocked
max_number = 13

# Target number you want to find
target = 3660


def min_operations_and_path(target, max_number):
    # Generate numbers from 1 to max_number
    numbers = list(range(1, max_number + 1))

    # Dictionary to store the minimum operations and path to reach each number
    operations = {num: (0, str(num), [f"Start with {num}"]) for num in numbers}

    # Queue for processing numbers, starting with all numbers from 1 to max_number
    queue = deque(numbers)

    while queue:
        current = queue.popleft()

        # Current number of operations, path, and detailed steps to reach `current`
        current_operations, current_path, current_steps = operations[current]

        for num in numbers:
            # Addition
            new_number = current + num
            if new_number <= target and new_number not in operations:
                new_path = f"{current_path}+{num}"
                new_steps = current_steps + [
                    f"Add {num} to {current} to get {new_number}"
                ]
                operations[new_number] = (current_operations + 1, new_path, new_steps)
                queue.append(new_number)

            # Subtraction
            new_number = current - num
            if new_number >= 1 and new_number not in operations:
                new_path = f"{current_path}-{num}"
                new_steps = current_steps + [
                    f"Subtract {num} from {current} to get {new_number}"
                ]
                operations[new_number] = (current_operations + 1, new_path, new_steps)
                queue.append(new_number)

            # Multiplication
            new_number = current * num
            if new_number <= target and new_number not in operations:
                new_path = f"({current_path})*{num}"
                new_steps = current_steps + [
                    f"Multiply {current} by {num} to get {new_number}"
                ]
                operations[new_number] = (current_operations + 1, new_path, new_steps)
                queue.append(new_number)

            # Division
            if num != 0 and current % num == 0:
                new_number = current // num
                if new_number >= 1 and new_number not in operations:
                    new_path = f"({current_path})/{num}"
                    new_steps = current_steps + [
                        f"Divide {current} by {num} to get {new_number}"
                    ]
                    operations[new_number] = (
                        current_operations + 1,
                        new_path,
                        new_steps,
                    )
                    queue.append(new_number)

            # Exponentiation
            if current != 1 and num != 1:  # Avoid infinite loop with 1^num
                try:
                    new_number = current**num
                    if new_number <= target and new_number not in operations:
                        new_path = f"({current_path})^{num}"
                        new_steps = current_steps + [
                            f"Raise {current} to the power of {num} to get {new_number}"
                        ]
                        operations[new_number] = (
                            current_operations + 1,
                            new_path,
                            new_steps,
                        )
                        queue.append(new_number)
                except OverflowError:
                    continue  # Skip cases where the exponentiation results in an overflow

            # Handle remainder as a new value
            if num != 0:
                remainder = current % num
                if remainder >= 1 and remainder not in operations:
                    new_path = f"({current_path})%{num}"
                    new_steps = current_steps + [
                        f"Take remainder of {current} divided by {num} to get {remainder}"
                    ]
                    operations[remainder] = (
                        current_operations + 1,
                        new_path,
                        new_steps,
                    )
                    queue.append(remainder)

        # Early exit if target is reached
        if target in operations:
            min_ops, path, steps = operations[target]
            return min_ops, path, steps

    # If no solution found, return -1 or an indication of impossibility
    if target in operations:
        min_ops, path, steps = operations[target]
        return min_ops, path, steps
    else:
        return -1, "No solution", []


min_ops, path, steps = min_operations_and_path(target, max_number)
print(
    f"Minimum operations needed to reach {target} using numbers from 1 to {max_number}: {min_ops}"
)
print(f"Path to reach {target}: {path}")
print("Detailed Steps:")
for step in steps:
    print(step)
