let courses = [];
fetch('/api/courses')
    .then(res => res.json())
    .then(data => {
        courses = data;
        renderPaths(); 
        renderCourseTabs(); 
        renderCourses();
        renderFeatured();
    })
    .catch(err => console.error("Error fetching courses:", err));
