class TriggerData{
    constructor(trigger, time){
        this.trigger = trigger;
        this.time = time;
        this.running = false;
    }
}

class User{
  constructor(userId, gmail){
    this.userId = userId;
    this.gmail = gmail;
  }
}

class TagInstance{
  constructor(name, minutes, color){
    this.name = name;
    this.minutes = minutes;
    this.color = color;
  }
}