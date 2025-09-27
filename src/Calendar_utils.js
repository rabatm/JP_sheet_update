const  updateDescriptionEventSerie = (titre,rdvDeb,rdvFin,user,calendarName,groupe,dayEN,semestreDateFin) => {
        let flag=false
        let currentCalendar = CalendarApp.getCalendarsByName(calendarName)
        const timeZone = "Europe/Paris";
        if (currentCalendar.length==0) {
              groupePrincipal=groupe.slice(0,3)
              currentCalendar=CalendarApp.createCalendar(calendarName,{
              color: getColorGroupe(groupePrincipal),
              timeZone: timeZone
            });  }
        const startdate =  new Date(rdvDeb);
        const endDate = new Date(rdvFin);
        const event = CalendarApp.getCalendarsByName(calendarName)[0].getEvents(startdate,new Date(endDate))
        event.map((event) =>{
        if (event.getTitle()===titre && event.getStartTime().getHours() === startdate.getHours() && event.getEndTime().getHours() === endDate.getHours()
        && event.getStartTime().getMinutes() === startdate.getMinutes() && event.getEndTime().getMinutes() === endDate.getMinutes()
        ) 
        {
             let description = event.getDescription();
             if (!description.includes(user)) {event.getEventSeries().setDescription(description + " - " + user) 

             }
             flag=true;
           }
         })
        if (!flag)
        { 
        let event = CalendarApp.getCalendarsByName(calendarName)[0].createEventSeries(titre,
          startdate,
          endDate,
          CalendarApp.newRecurrence().addWeeklyRule()
            .onlyOnWeekday(CalendarApp.Weekday[dayEN])
            .until(new Date(semestreDateFin)),
            {description: user}); 
          }
}