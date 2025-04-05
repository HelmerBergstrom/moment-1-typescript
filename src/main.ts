interface CourseInfo {
    code: string;
    coursename: string;
    progression: 'A' | 'B' | 'C';
    syllabus: string;
}   

window.addEventListener("DOMContentLoaded", async () => {
    const courses = await fetchCourses();
    displayCourses(courses);
});

async function fetchCourses(): Promise<CourseInfo[]> {
    // Hämtar från localstorage om informationen finns där först. 
    const localStorageData = localStorage.getItem("courses");
    
    if(localStorageData) {
        console.log(localStorageData)
        return JSON.parse(localStorageData) as CourseInfo[];
    }

    try {
        const response = await fetch("https://webbutveckling.miun.se/files/ramschema_ht24.json");

        if(!response.ok) {
            throw new Error('Fel!')
        }
        
        const courses: CourseInfo[] = await response.json();

        // Lagrar i localstorage.
        localStorage.setItem("courses", JSON.stringify(courses))

        console.log(courses)
        return courses;
    } catch (error) {
        console.error('Fel ', error);
        return []; // Promise fungerar ej om funktionen kan returnera något annat än en Array, därav tom array.
    }  
};

function displayCourses(courses: CourseInfo[]) {
    




}

