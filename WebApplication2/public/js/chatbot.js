document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.querySelector('.chat-button');
    const chatWindow = document.querySelector('.chat-window');
    const minimizeButton = document.querySelector('.minimize-button');
    const messagesContainer = document.querySelector('.chat-messages');
    const input = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-button');

    // Initialize quick actions and booking interface if they don't exist
    let quickActionsHtml = `
        <div class="quick-actions">
            <button class="action-button prm-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Book PRM Meeting
            </button>
            <button class="action-button support-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Technical Support
            </button>
            <button class="action-button ai-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2"/>
                    <path d="M6 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2"/>
                    <path d="M18 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2"/>
                </svg>
                Chat with AI
            </button>
        </div>
    `;

    let bookingInterfaceHtml = `
        <div class="booking-interface hidden">
            <div class="booking-inputs">
                <input type="date" class="booking-date" min="">
                <select class="booking-time">
                    <option value="">Select Time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                </select>
            </div>
            <button class="booking-confirm">Confirm Booking</button>
        </div>
    `;

    // Add quick actions and booking interface after the first message
    const firstMessage = messagesContainer.querySelector('.message.bot');
    if (firstMessage) {
        firstMessage.insertAdjacentHTML('afterend', quickActionsHtml + bookingInterfaceHtml);
    }

    // Set minimum date to today
    const dateInput = document.querySelector('.booking-date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }

    // Toggle chat window
    chatButton.addEventListener('click', (e) => {
        e.preventDefault();
        chatWindow.classList.toggle('active');
    });

    minimizeButton.addEventListener('click', (e) => {
        e.preventDefault();
        chatWindow.classList.remove('active');
    });

    // Handle sending messages
    function addMessage(text, isBot = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isBot ? 'bot' : 'user'}`;

        const content = document.createElement('p');
        content.textContent = text;

        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageDiv.appendChild(content);
        messageDiv.appendChild(timestamp);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, false);
        input.value = '';

        // Hide quick actions after first user message
        const quickActions = document.querySelector('.quick-actions');
        if (quickActions) {
            quickActions.style.display = 'none';
        }

        // Simple bot response
        setTimeout(() => {
            addMessage("How else can I help you today?", true);
        }, 1000);
    }

    sendButton.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Handle quick action buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.action-button')) {
            const button = e.target.closest('.action-button');
            const action = button.textContent.trim();
            addMessage(action, false);

            // Hide quick actions
            const quickActions = document.querySelector('.quick-actions');
            if (quickActions) {
                quickActions.style.display = 'none';
            }

            setTimeout(() => {
                if (action.includes('Book PRM Meeting')) {
                    const bookingInterface = document.querySelector('.booking-interface');
                    if (bookingInterface) {
                        bookingInterface.classList.remove('hidden');
                    }
                    addMessage('Please select your preferred date and time for the PRM meeting.', true);
                } else if (action.includes('Technical Support')) {
                    addMessage('Please describe your technical issue and I\'ll help you get it resolved.', true);
                } else if (action.includes('Chat with AI')) {
                    addMessage('I\'m Unity\'s AI assistant. What would you like to know about Unity?', true);
                }
            }, 500);
        }
    });

    // Handle booking confirmation
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('booking-confirm')) {
            const date = document.querySelector('.booking-date').value;
            const time = document.querySelector('.booking-time').value;

            if (!date || !time) {
                addMessage('Please select both a date and time for your meeting.', true);
                return;
            }

            const bookingInterface = document.querySelector('.booking-interface');
            if (bookingInterface) {
                bookingInterface.classList.add('hidden');
            }

            addMessage(`Meeting booked for ${date} at ${time}`, false);
            setTimeout(() => {
                addMessage('Your meeting has been confirmed! You\'ll receive a confirmation email shortly.', true);
            }, 500);
        }
    });

    // Close chat window when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatWindow.contains(e.target) && !chatButton.contains(e.target)) {
            chatWindow.classList.remove('active');
        }
    });
});