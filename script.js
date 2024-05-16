function minOperationsAndPath(target, maxNumber) {
    const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
    const operations = {};
    numbers.forEach(num => {
        operations[num] = [0, `${num}`, [`Start with ${num}`]];
    });

    const queue = [...numbers];

    while (queue.length) {
        const current = queue.shift();
        const [currentOperations, currentPath, currentSteps] = operations[current];

        for (const num of numbers) {
            // Addition
            let newNumber = current + num;
            if (newNumber <= target && !operations[newNumber]) {
                const newPath = `${currentPath}+${num}`;
                const newSteps = [...currentSteps, `Add ${num} to ${current} to get ${newNumber}`];
                operations[newNumber] = [currentOperations + 1, newPath, newSteps];
                queue.push(newNumber);
            }

            // Subtraction
            newNumber = current - num;
            if (newNumber >= 1 && !operations[newNumber]) {
                const newPath = `${currentPath}-${num}`;
                const newSteps = [...currentSteps, `Subtract ${num} from ${current} to get ${newNumber}`];
                operations[newNumber] = [currentOperations + 1, newPath, newSteps];
                queue.push(newNumber);
            }

            // Multiplication
            newNumber = current * num;
            if (newNumber <= target && !operations[newNumber]) {
                const newPath = `(${currentPath})*${num}`;
                const newSteps = [...currentSteps, `Multiply ${current} by ${num} to get ${newNumber}`];
                operations[newNumber] = [currentOperations + 1, newPath, newSteps];
                queue.push(newNumber);
            }

            // Division
            if (num !== 0 && current % num === 0) {
                newNumber = Math.floor(current / num);
                if (newNumber >= 1 && !operations[newNumber]) {
                    const newPath = `(${currentPath})/${num}`;
                    const newSteps = [...currentSteps, `Divide ${current} by ${num} to get ${newNumber}`];
                    operations[newNumber] = [currentOperations + 1, newPath, newSteps];
                    queue.push(newNumber);
                }
            }

            // Exponentiation
            if (current !== 1 && num !== 1) {
                try {
                    newNumber = Math.pow(current, num);
                    if (newNumber <= target && !operations[newNumber]) {
                        const newPath = `(${currentPath})^${num}`;
                        const newSteps = [...currentSteps, `Raise ${current} to the power of ${num} to get ${newNumber}`];
                        operations[newNumber] = [currentOperations + 1, newPath, newSteps];
                        queue.push(newNumber);
                    }
                } catch (error) {
                    continue;
                }
            }

            // Handle remainder as a new value
            if (num !== 0) {
                const remainder = current % num;
                if (remainder >= 1 && !operations[remainder]) {
                    const newPath = `(${currentPath})%${num}`;
                    const newSteps = [...currentSteps, `Take remainder of ${current} divided by ${num} to get ${remainder}`];
                    operations[remainder] = [currentOperations + 1, newPath, newSteps];
                    queue.push(remainder);
                }
            }

            // Early exit if target is reached
            if (operations[target]) {
                return operations[target];
            }
        }
    }

    return operations[target] || [-1, "No solution", []];
}

function optimize() {
    const maxNumber = parseInt(document.getElementById('maxNumber').value);
    const target = parseInt(document.getElementById('target').value);
    const [minOps, path, steps] = minOperationsAndPath(target, maxNumber);

    document.getElementById('path').innerText = `Path to ${target}: ${path}`;
    document.getElementById('result').innerText = `Minimum operations needed to reach ${target} using 1-${maxNumber} is ${minOps}`;
    document.getElementById('steps').innerText = steps.join('\n');
}

// Add event listener to handle Enter key submission
document.addEventListener('DOMContentLoaded', (event) => {
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            optimize();
        }
    });
});
