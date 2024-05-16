from collections import deque

# User inputs
max_number = 2
target = 233223


def combine_steps(steps):
    # Combine consecutive additions or subtractions
    combined_steps = []
    i = 0
    while i < len(steps):
        if "Add" in steps[i] or "Subtract" in steps[i]:
            current_op = "Add" if "Add" in steps[i] else "Subtract"
            current_val = int(steps[i].split()[-1])
            combined_step = steps[i]
            i += 1
            while i < len(steps) and current_op in steps[i]:
                current_val += int(steps[i].split()[-1])
                combined_step = f"{current_op} {current_val} to get {current_val}"
                i += 1
            combined_steps.append(combined_step)
        else:
            combined_steps.append(steps[i])
            i += 1
    return combined_steps


def min_operations_and_path(target, max_number):
    numbers = list(range(1, max_number + 1))
    operations = {num: (0, str(num), [f"Start with {num}"]) for num in numbers}
    queue = deque(numbers)
    visited = set(numbers)

    while queue:
        current = queue.popleft()
        current_operations, current_path, current_steps = operations[current]

        for num in numbers:
            # List of potential operations
            potential_operations = [
                (
                    current + num,
                    f"{current_path}+{num}",
                    f"Add {num} to {current} to get {current + num}",
                ),
                (
                    current - num,
                    f"{current_path}-{num}",
                    f"Subtract {num} from {current} to get {current - num}",
                ),
                (
                    current * num,
                    f"({current_path})*{num}",
                    f"Multiply {current} by {num} to get {current * num}",
                ),
            ]

            # Include division only if it is valid
            if num != 0 and current % num == 0:
                potential_operations.append(
                    (
                        current // num,
                        f"({current_path})/{num}",
                        f"Divide {current} by {num} to get {current // num}",
                    )
                )

            # Include exponentiation only if it does not overflow
            if current != 1 and num != 1:
                try:
                    exp_result = current**num
                    if exp_result <= target:
                        potential_operations.append(
                            (
                                exp_result,
                                f"({current_path})^{num}",
                                f"Raise {current} to the power of {num} to get {exp_result}",
                            )
                        )
                except OverflowError:
                    pass

            # Include remainder only if it is valid
            if num != 0:
                remainder = current % num
                potential_operations.append(
                    (
                        remainder,
                        f"({current_path})%{num}",
                        f"Take remainder of {current} divided by {num} to get {remainder}",
                    )
                )

            for new_number, new_path, new_step in potential_operations:
                if new_number <= target and new_number not in visited:
                    new_steps = current_steps + [new_step]
                    operations[new_number] = (
                        current_operations + 1,
                        new_path,
                        combine_steps(new_steps),
                    )
                    queue.append(new_number)
                    visited.add(new_number)

                    if new_number == target:
                        return (
                            current_operations + 1,
                            new_path,
                            combine_steps(new_steps),
                        )

    return -1, "No solution", []


min_ops, path, steps = min_operations_and_path(target, max_number)
print(
    f"Minimum operations needed to reach {target} using numbers from 1 to {max_number}: {min_ops}"
)
print(f"Path to reach {target}: {path}")
print("Detailed Steps:")
for step in steps:
    print(step)
