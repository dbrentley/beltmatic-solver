function minOperationsAndPath(target, maxNumber) {
    // Generate numbers from 1 to maxNumber
    const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);

    // Dictionary to store the minimum operations and path to reach each number
    const operations = {
        0: { ops: 0, path: "", steps: [] }
    };  // It takes 0 operations to reach 0, with an empty path and steps

    // Queue for processing numbers, starting from 0
    const queue = [0];

    while (queue.length > 0) {
        const current = queue.shift();

        // Current number of operations, path, and detailed steps to reach `current`
        const { ops: currentOperations, path: currentPath, steps: currentSteps } = operations[current];

        for (const num of numbers) {
            // Addition
            let newNumber = current + num;
            if (newNumber <= target && !(newNumber in operations)) {
                const newPath = currentPath ? `${currentPath}+${num}` : `${num}`;
                const newSteps = [...currentSteps, `Add ${num} to ${current} to get ${newNumber}`];
                operations[newNumber] = { ops: currentOperations + 1, path: newPath, steps: newSteps };
                queue.push(newNumber);
            }

            // Subtraction
            newNumber = current - num;
            if (newNumber >= 0 && !(newNumber in operations)) {
                const newPath = currentPath ? `${currentPath}-${num}` : `-${num}`;
                const newSteps = [...currentSteps, `Subtract ${num} from ${current} to get ${newNumber}`];
                operations[newNumber] = { ops: currentOperations + 1, path: newPath, steps: newSteps };
                queue.push(newNumber);
            }

            // Multiplication
            newNumber = current * num;
            if (newNumber <= target && !(newNumber in operations)) {
                const newPath = currentPath ? `(${currentPath})*${num}` : `${num}`;
                const newSteps = [...currentSteps, `Multiply ${current} by ${num} to get ${newNumber}`];
                operations[newNumber] = { ops: currentOperations + 1, path: newPath, steps: newSteps };
                queue.push(newNumber);
            }

            // Division
            if (num !== 0 && current % num === 0) {
                newNumber = current / num;
                if (!(newNumber in operations)) {
                    const newPath = currentPath ? `(${currentPath})/${num}` : `1/${num}`;
                    const newSteps = [...currentSteps, `Divide ${current} by ${num} to get ${newNumber}`];
                    operations[newNumber] = { ops: currentOperations + 1, path: newPath, steps: newSteps };
                    queue.push(newNumber);
                }
            }

            // Exponentiation
            if (current !== 0 && num !== 1) {  // Avoid infinite loop with 0^num and 1^num
                try {
                    newNumber = Math.pow(current, num);
                    if (newNumber <= target && !(newNumber in operations)) {
                        const newPath = currentPath ? `(${currentPath})^${num}` : `${current}^${num}`;
                        const newSteps = [...currentSteps, `Raise ${current} to the power of ${num} to get ${newNumber}`];
                        operations[newNumber] = { ops: currentOperations + 1, path: newPath, steps: newSteps };
                        queue.push(newNumber);
                    }
                } catch (e) {
                    continue;  // Skip cases where the exponentiation results in an overflow
                }
            }
        }

        // Early exit if target is reached
        if (target in operations) {
            const { ops, path, steps } = operations[target];
            return { ops, path, steps };
        }
    }

    // If no solution found, return -1 or an indication of impossibility
    if (target in operations) {
        const { ops, path, steps } = operations[target];
        return { ops, path, steps };
    } else {
        return { ops: -1, path: "No solution", steps: [] };
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const maxNumberInput = document.getElementById("max-number");
    const targetInput = document.getElementById("target");
    const resultDiv = document.getElementById("result");

    document.getElementById("calculate").addEventListener("click", () => {
        const maxNumber = parseInt(maxNumberInput.value);
        const target = parseInt(targetInput.value);

        const { ops, path, steps } = minOperationsAndPath(target, maxNumber);
        resultDiv.innerHTML = `
            <p>Minimum operations needed to reach ${target} using numbers from 1 to ${maxNumber}: ${ops}</p>
            <p>Path to reach ${target}: ${path}</p>
            <p>Detailed Steps:</p>
            <ul>${steps.slice(1).map(step => `<li>${step}</li>`).join('')}</ul>
        `;
    });
});
