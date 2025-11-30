// Global variables
let currentTab = 'html';
let savedCode = {
    html: '',
    css: '',
    js: '',
    python: '',
    sql: ''
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCodeEditor();
    loadSavedCode();
    updateActiveNav();
});

// Navigation active state
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Code Editor Functions
function initializeCodeEditor() {
    // Set default code for each language
    if (!savedCode.html) {
        document.getElementById('html-code').value = `<!DOCTYPE html>
<html>
<head>
    <title>My Web Page</title>
</head>
<body>
    <h1>Welcome to CodeMaster!</h1>
    <p>Start coding here...</p>
</body>
</html>`;
    }
    
    if (!savedCode.css) {
        document.getElementById('css-code').value = `body {
    font-family: Arial, sans-serif;
    margin: 40px;
    background: #f5f5f5;
}
h1 {
    color: #2563eb;
}`;
    }
    
    if (!savedCode.js) {
        document.getElementById('js-code').value = `document.addEventListener('DOMContentLoaded', function() {
    console.log('Welcome to CodeMaster!');
    // Add your JavaScript here
    document.querySelector('h1').addEventListener('click', function() {
        this.style.color = '#7c3aed';
    });
});`;
    }
    
    if (!savedCode.python) {
        document.getElementById('python-code').value = `print("Welcome to CodeMaster!")

def calculate_sum(a, b):
    return a + b

result = calculate_sum(5, 3)
print(f"5 + 3 = {result}")`;
    }
    
    if (!savedCode.sql) {
        document.getElementById('sql-code').value = `-- Sample SQL queries
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    age INT
);

INSERT INTO students VALUES 
(1, 'John Doe', 20),
(2, 'Jane Smith', 22);

SELECT * FROM students;`;
    }
}

// Switch between code tabs
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show selected code area
    document.querySelectorAll('.code-text').forEach(textarea => {
        textarea.classList.remove('active');
    });
    document.getElementById(tabName + '-code').classList.add('active');
}

// Run code function
function runCode() {
    const htmlCode = document.getElementById('html-code').value;
    const cssCode = document.getElementById('css-code').value;
    const jsCode = document.getElementById('js-code').value;
    const outputFrame = document.getElementById('output-frame');
    
    const outputDoc = outputFrame.contentDocument || outputFrame.contentWindow.document;
    
    outputDoc.open();
    outputDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>${cssCode}</style>
        </head>
        <body>
            ${htmlCode}
            <script>${jsCode}<\/script>
        </body>
        </html>
    `);
    outputDoc.close();
    
    // Save code automatically
    saveCode();
}

// Save code to localStorage
function saveCode() {
    savedCode = {
        html: document.getElementById('html-code').value,
        css: document.getElementById('css-code').value,
        js: document.getElementById('js-code').value,
        python: document.getElementById('python-code').value,
        sql: document.getElementById('sql-code').value
    };
    
    localStorage.setItem('codemaster_saved_code', JSON.stringify(savedCode));
    showNotification('Code saved successfully!', 'success');
}

// Load saved code from localStorage
function loadSavedCode() {
    const saved = localStorage.getItem('codemaster_saved_code');
    if (saved) {
        savedCode = JSON.parse(saved);
        
        document.getElementById('html-code').value = savedCode.html;
        document.getElementById('css-code').value = savedCode.css;
        document.getElementById('js-code').value = savedCode.js;
        document.getElementById('python-code').value = savedCode.python;
        document.getElementById('sql-code').value = savedCode.sql;
    }
}

// Reset code to default
function resetCode() {
    if (confirm('Are you sure you want to reset all code?')) {
        localStorage.removeItem('codemaster_saved_code');
        savedCode = {
            html: '',
            css: '',
            js: '',
            python: '',
            sql: ''
        };
        initializeCodeEditor();
        showNotification('Code reset successfully!', 'info');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideIn 0.3s ease;
            }
            .notification.success { background: #10b981; }
            .notification.error { background: #ef4444; }
            .notification.info { background: #3b82f6; }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Course and Category Functions
function showCategory(category) {
    const categories = {
        'webdev': 'Web Development',
        'cybersecurity': 'Cyber Security', 
        'ai': 'AI & Machine Learning',
        'hacking': 'Ethical Hacking'
    };
    
    showNotification(`Opening ${categories[category]} category...`, 'info');
    // In real implementation, this would navigate to the category page
}

// Challenge Functions
function loadChallenge(challengeName) {
    const challenges = {
        'fibonacci': {
            title: 'Fibonacci Sequence',
            description: 'Write a function to generate Fibonacci sequence',
            code: `function fibonacci(n) {
    // Write your code here
    // Return array of first n Fibonacci numbers
}`
        },
        'palindrome': {
            title: 'Palindrome Checker', 
            description: 'Check if a string is a palindrome',
            code: `function isPalindrome(str) {
    // Write your code here
    // Return true if string is palindrome
}`
        },
        'sorting': {
            title: 'Sorting Algorithm',
            description: 'Implement a sorting algorithm',
            code: `function bubbleSort(arr) {
    // Write your code here
    // Return sorted array
}`
        }
    };
    
    const challenge = challenges[challengeName];
    if (challenge) {
        document.getElementById('js-code').value = challenge.code;
        switchTab('js');
        showNotification(`Loaded challenge: ${challenge.title}`, 'info');
    }
}

// Cyber Security Lab Functions
function startLab(labType) {
    const labs = {
        'nmap-scan': 'Nmap Network Scanning',
        'metasploit': 'Metasploit Framework',
        'sql-injection': 'SQL Injection Practice',
        'xss-attack': 'XSS Attack Simulation'
    };
    
    showNotification(`Starting lab: ${labs[labType]}`, 'info');
    
    // Simulate terminal output for security labs
    if (labType === 'nmap-scan') {
        simulateTerminalOutput(`
Starting Nmap 7.80 scan...
Discovered hosts:
192.168.1.1 - Router
192.168.1.100 - Web Server
192.168.1.150 - Database Server

Open ports found:
22/tcp   ssh
80/tcp   http
443/tcp  https
3306/tcp mysql
        `);
    }
}

function simulateTerminalOutput(output) {
    const terminal = document.querySelector('.terminal-content');
    if (terminal) {
        const outputElement = document.createElement('div');
        outputElement.className = 'terminal-output';
        outputElement.innerHTML = output;
        terminal.appendChild(outputElement);
    }
}

// AI Lab Functions  
function startAILab(labType) {
    const aiLabs = {
        'linear-regression': 'Linear Regression Model',
        'neural-network': 'Neural Network Implementation',
        'image-classification': 'Image Classification'
    };
    
    showNotification(`Starting AI lab: ${aiLabs[labType]}`, 'info');
    
    // Load sample AI code
    if (labType === 'linear-regression') {
        document.getElementById('python-code').value = `# Linear Regression Example
import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

# Sample data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([1, 3, 2, 3, 5])

# Create and train model
model = LinearRegression()
model.fit(X, y)

# Make prediction
X_test = np.array([[6]])
prediction = model.predict(X_test)

print(f"Prediction for 6: {prediction[0]:.2f}")

# Plot results
plt.scatter(X, y, color='blue')
plt.plot(X, model.predict(X), color='red')
plt.title('Linear Regression')
plt.show()`;
        switchTab('python');
    }
}

// Projects Filter Function
function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Update active filter button
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(category)) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide projects based on category
    projectCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Terminal Simulation for Cyber Security
function setupTerminal() {
    const terminalInput = document.getElementById('terminal-cmd');
    if (terminalInput) {
        terminalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const command = this.value;
                executeTerminalCommand(command);
                this.value = '';
            }
        });
    }
}

function executeTerminalCommand(command) {
    const terminal = document.querySelector('.terminal-content');
    const commands = {
        'nmap -sS 192.168.1.1/24': `Starting Nmap 7.80 scan...
Discovered open ports on 192.168.1.1:
22/tcp   ssh
80/tcp   http
443/tcp  https`,

        'whoami': 'root',
        
        'pwd': '/root/security-labs',
        
        'ls': `vulnerability-scanner.py
network-monitor.sh
pentest-tools/`,

        'help': `Available commands:
- nmap [target]
- whoami
- pwd
- ls
- help`
    };
    
    // Add command to terminal
    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line';
    commandLine.innerHTML = `<span class="prompt">root@codemaster:~#</span> <span class="command">${command}</span>`;
    terminal.appendChild(commandLine);
    
    // Add output
    const output = document.createElement('div');
    output.className = 'terminal-output';
    output.textContent = commands[command] || `Command not found: ${command}`;
    terminal.appendChild(output);
    
    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

// Initialize terminal when page loads
if (document.querySelector('.terminal-content')) {
    setupTerminal();
}

// Page specific initializations
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'ethical-hacking.html':
            // Initialize hacking labs
            break;
        case 'ai-ml.html':
            // Initialize AI labs
            break;
        case 'practice.html':
            // Initialize code editor
            initializeCodeEditor();
            break;
    }
}

// Call initialization
initializePage();