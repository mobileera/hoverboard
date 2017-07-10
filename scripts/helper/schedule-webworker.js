function getSession(session, day, dayIndex, schedule, speakersRaw) {
  session.mainTag = session.tags ? session.tags[0] : 'General';
  session.day = dayIndex + 1;

  if (day.tags.indexOf(session.mainTag) < 0) {
    day.tags.push(session.mainTag);
  }
  if (schedule.tags.indexOf(session.mainTag) < 0) {
    schedule.tags.push(session.mainTag);
  }
  var speakers = [];
  if (session.speakers) {
    for (var j = 0, speakersLen = session.speakers.length; j < speakersLen; j++) {
      if (!session.speakers[j].id) {
        session.speakers[j] = speakersRaw[session.speakers[j]];
        var tempSession = JSON.parse(JSON.stringify(session));
        delete tempSession.speakers;
        if (session.speakers[j]) {
          if (!session.speakers[j].sessions) {
            session.speakers[j].sessions = [];
          }
          session.speakers[j].sessions.push(tempSession);
          speakers.push(session.speakers[j].name);
        }
      }
    }
  }
  return session;
}

function getEndTime(date, startTime, endTime, totalNumber, number) {
  var timezone = new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1],
    timeStart = new Date(date + ' ' + startTime + ' ' + timezone).getTime(),
    timeEnd = new Date(date + ' ' + endTime + ' ' + timezone).getTime(),
    difference = Math.floor((timeEnd - timeStart) / totalNumber),
    result = new Date(timeStart + difference * number);
  return result.getHours() + ':' + result.getMinutes();
}

self.addEventListener('message', function (e) {
  var speakers = e.data.speakers;
  var instructors = e.data.instructors;
  var sessions = e.data.sessions;
  var workshops = e.data.workshops;
  var schedule = e.data.schedule;

  for (var i = 0, instructorsLen = instructors.length; i < instructorsLen; i++) {
    instructors[i].workshop = new Object()
    instructors[i].workshop.price = "2990 NOK + VAT"
    var workshopId = instructors[i].workshopId
    if (workshops != null) {
      for (var j = 0, workshopsLen = workshops.length; j < workshopsLen; j++) {
        if (workshopId == workshops[j].id) {
          instructors[i].workshop = workshops[j]
          break
        }
      }
    } 

    // test
    if (instructors[i].id == 228) {
      instructors[i].workshop.title = "Continuous Deployment: Automate your app release process with fastlane"
      instructors[i].workshop.description = `Releasing an app to the AppStore or PlayStore is a daunting, time consuming, and error-prone process. Worst of all, this chore is usually reserved for your most senior team members. Did it pass all of your tests? Did you add all of the necessary screenshots in every language? Did you remember to bump the version number? Do you have the information for all of the required fields on the AppStore?
 
  Imagine saving hours of time automating this process. And having the confidence that a new team member can release an app on their first day on the job, right from the command line!
  With *fastlane*, you can automate your entire release process for iOS and Android to achieve Continuous Deployment. After this workshop, you will be able to automatically:
  1. Create screenshots
  2. Resolve code signing and provisioning issues
  3. Submit the app the App or Play Stores
  4. Invite beta testers
  5. And explore more tools via fastlane plugins!
 
This workshop is for mobile developers ready to submit their app for the first time, as well as developers who are tired of having to do it all of the time.`
      instructors[i].workshop.price = "2990 NOK + VAT"
    }
    if (instructors[i].id == 229) {
      instructors[i].workshop.title = "Reactive Programming with RxSwift"
      instructors[i].workshop.description = `RxSwift is a trending framework for Reactive Programming in Swift. It has been around since 2 years now and has a constant growth and new users daily.
    In this workshop you will be introduced to RxSwift gradually,  starting from the basics of Observables and Subscriptions to most advanced concepts like Traits and RxCocoa.
    The workshop will guide you gradually thought:
  1. Intro to Observables
  2. Intro to Subjects
  3. Basic Operators
  4. Advanced Operators
  5. Intro to RxCocoa 
  6. Testing with RxSwift`
    }
    if (instructors[i].id == 230) {
      instructors[i].workshop.title = "Kotlin for Java developers"
      instructors[i].workshop.description = `The Kotlin programming language is developed by JetBrains and now is an officially-supported language for Android Development. This full-day workshop aims to share with you the power and the beauty of the language. We imply that you consider using Kotlin in your every-day work and want to feel more confident with the language first. We'll have a basic overview of the language, as well as the discussion of some corner cases, especially concerning Java interoperability. The workshop is based on your Java experience; it shows the similarities between two languages and focuses on what's going to be different.
    We'll cover:
  * Basic syntax
  * Nullability
  * Object-oriented programming
  * Functional programming
  * Java interoperability
  * Building DSLs`
    }
    if (instructors[i].id == 231) {
      instructors[i].workshop.title = "Building Cross Platform Native Mobile Apps using React Native"
      instructors[i].workshop.description = `In this full-day workshop, you will learn the fundamentals of building cross-platform mobile apps targeting iOS and Android devices using React Native. React Native lets you build mobile apps using only JavaScript, without the need to use languages like Objective-C, Swift, or Java. Although you write JavaScript with React Native, the components you define will end up rendering as native widgets on the respective platforms. Hence, React Native allows you to write truly native applications, with the ease and speed of development and debugging using JavaScript.`
    }

  }

  schedule.tags = [];
  for (var i = 0, scheduleLen = schedule.length; i < scheduleLen; i++) {
    var day = schedule[i];
    schedule[i].tags = [];
    for (var j = 0, timeslotsLen = day.timeslots.length; j < timeslotsLen; j++) {
      var timeslot = day.timeslots[j];
      for (var k = 0, sessionsLen = timeslot.sessions.length; k < sessionsLen; k++) {
        for (var l = 0, subSessionsLen = timeslot.sessions[k].length; l < subSessionsLen; l++) {
          var session = getSession(sessions[timeslot.sessions[k][l]], day, i, schedule, speakers);
          if (session && !session.track) {
            session.track = day.tracks[k];
          }
          session.startTime = timeslot.startTime;
          session.endTime = subSessionsLen > 1 ? getEndTime(day.date, timeslot.startTime, timeslot.endTime, subSessionsLen, l + 1) : timeslot.endTime;
          session.dateReadable = day.dateReadable;
          schedule[i].timeslots[j].sessions[k][l] = session;
        }
      }
    }
  }

  self.postMessage({
    speakers: speakers,
    instructors: instructors,
    sessions: sessions,
    workshops: workshops,
    schedule: schedule
  });
}, false);
