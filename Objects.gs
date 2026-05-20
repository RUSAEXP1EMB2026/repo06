class TriggerData{
    constructor(trigger, time){
        this.trigger = trigger;
        this.time = time;
        this.running = false;
    }
}

class User{
  constructor(userId, gmail, remoToken){
    this.userId = userId;
    this.gmail = gmail;
    this.remoToken = remoToken;
  }
}

class TagInstance{
  constructor(name, minutes, color){
    this.name = name;
    this.minutes = minutes;
    this.color = color;
  }
}