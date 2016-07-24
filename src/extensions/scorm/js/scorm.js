var success = pipwerks.SCORM.init();
if(success){
	var status = pipwerks.SCORM.get("cmi.core.lesson_status");
	if(status != "completed"){
		success = pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
		if(success){
			pipwerks.SCORM.quit();
		}
	}
}