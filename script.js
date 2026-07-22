// ==========================================
// Medicine Reminder Feature
// ==========================================
const medForm = document.getElementById("medForm");
const medList = document.getElementById("medList");
const reminders = [];

// Request notification permission on page load
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

medForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("medName").value;
  const time = document.getElementById("medTime").value;

  const reminder = { id: Date.now(), name, time };
  reminders.push(reminder);

  // Clear empty state
  const emptyFeed = medList.querySelector(".empty-feed");
  if (emptyFeed) emptyFeed.remove();

  // Render item in UI
  const li = document.createElement("li");
  li.setAttribute("data-id", reminder.id);
  li.innerHTML = `
    <span>💊 <strong>${name}</strong> at ${time}</span>
    <button class="btn-secondary" style="padding: 2px 8px; font-size: 12px; color: #ef4444; border-color: #ef4444;" onclick="deleteReminder(${reminder.id})">Delete</button>
  `;
  medList.appendChild(li);

  showToast(`⏰ Reminder set for ${name} at ${time}`);
  medForm.reset();
});

// Delete Reminder Function
window.deleteReminder = function(id) {
  const index = reminders.findIndex(r => r.id === id);
  if (index !== -1) reminders.splice(index, 1);

  const item = medList.querySelector(`[data-id="${id}"]`);
  if (item) item.remove();

  if (reminders.length === 0) {
    medList.innerHTML = '<li class="empty-feed">No active reminders set.</li>';
  }
};

// Check for Reminders Every 30 Seconds
setInterval(() => {
  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;

  reminders.forEach((r) => {
    if (r.time === currentTime && !r.notified) {
      r.notified = true; // Avoid repeated alerts within the same minute

      // Trigger Browser Notification if permitted
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("💊 Time for your medicine!", {
          body: `Don't forget to take: ${r.name}`,
        });
      }

      // Fallback Toast Alert
      showToast(`🔔 TIME TO TAKE: ${r.name}!`);
    }
  });
}, 30000);