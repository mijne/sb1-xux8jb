export class EventTracker {
  static isTracking = false;
  static events = [];

  static start() {
    this.isTracking = true;
    this.events = [];
    this.attachListeners();
  }

  static stop() {
    this.isTracking = false;
    this.detachListeners();
    this.saveEvents();
  }

  static handleClick = (event) => {
    if (!this.isTracking) return;
    
    this.events.push({
      type: 'click',
      timestamp: new Date().toISOString(),
      target: {
        tagName: event.target.tagName,
        className: event.target.className,
        id: event.target.id
      },
      position: {
        x: event.clientX,
        y: event.clientY
      }
    });
  }

  static handleKeyPress = (event) => {
    if (!this.isTracking) return;

    this.events.push({
      type: 'keypress',
      timestamp: new Date().toISOString(),
      key: event.key,
      target: {
        tagName: event.target.tagName,
        className: event.target.className,
        id: event.target.id
      }
    });
  }

  static attachListeners() {
    document.addEventListener('click', this.handleClick);
    document.addEventListener('keypress', this.handleKeyPress);
  }

  static detachListeners() {
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('keypress', this.handleKeyPress);
  }

  static saveEvents() {
    const eventsBlob = new Blob([JSON.stringify(this.events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(eventsBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}