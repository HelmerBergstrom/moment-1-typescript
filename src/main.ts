interface CourseInfo {
    code: string;
    name: string;
    progression: 'A' | 'B' | 'C';
    syllabus: string;
}

// Promise att funktionen ska returnera en array "CourseInfo" när hämtningen är klar!
async function fetchCourses(): Promise<CourseInfo[]> {
    const response = await fetch('https://webbutveckling.miun.se/files/ramschema_ht24.json');
    if(!response.ok) {
        throw new Error('Fel!');
    }

    const courses: CourseInfo[] = await response.json();
    return courses;
};

function saveCourses(courses: CourseInfo[]): void {
    localStorage.setItem('courses', JSON.stringify(courses));
};

// Hämtar kurserna till "courses".
// returnerar courses och omvandlar datan till array.
// finns ingen data att hämta blir det en tom array.
function getCourses(): CourseInfo[] {
    const courses = localStorage.getItem('courses');
    return courses ? JSON.parse(courses) : [] ;
};