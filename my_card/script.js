// ====== 내 소개 카드 기능 ======
const userNameInput = document.getElementById('userName');
const userJobInput = document.getElementById('userJob');
const userBioInput = document.getElementById('userBio');

const previewName = document.getElementById('previewName');
const previewJob = document.getElementById('previewJob');
const previewBio = document.getElementById('previewBio');

// 입력값이 변할 때마다 미리보기 업데이트
userNameInput.addEventListener('input', function() {
    previewName.textContent = this.value || '이름';
});

userJobInput.addEventListener('input', function() {
    previewJob.textContent = this.value || '직업';
});

userBioInput.addEventListener('input', function() {
    previewBio.textContent = this.value || '자기소개';
});

// ====== 시간표 기능 ======
const timeIntervalSelect = document.getElementById('timeInterval');
const timetableBody = document.getElementById('timetableBody');
const addClassBtn = document.getElementById('addClassBtn');

let classes = [];
let timeInterval = 60; // 기본값: 1시간

// 시간을 "HH:MM" 형식으로 변환하는 함수
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// 시간 간격 변경 이벤트
timeIntervalSelect.addEventListener('change', function() {
    timeInterval = parseInt(this.value);
    renderTimetable();
});

// 시간표 렌더링
function renderTimetable() {
    timetableBody.innerHTML = '';
    
    // 1교시부터 8교시까지
    for (let period = 1; period <= 8; period++) {
        // 시작 시간 계산 (1교시 = 9시)
        const startMinutes = 9 * 60 + (period - 1) * timeInterval;
        const endMinutes = startMinutes + timeInterval;
        
        const startTime = minutesToTime(startMinutes);
        const endTime = minutesToTime(endMinutes);
        const timeRange = `${startTime} - ${endTime}`;
        
        // 이 교시에 해당하는 강의 찾기
        const classForPeriod = classes.find(c => c.period === period);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${period}교시</td>
            <td>${timeRange}</td>
            <td><input type="text" placeholder="강의명" value="${classForPeriod?.name || ''}" class="class-name" data-period="${period}"></td>
            <td><input type="text" placeholder="강의실" value="${classForPeriod?.room || ''}" class="class-room" data-period="${period}"></td>
            <td><input type="text" placeholder="교수" value="${classForPeriod?.professor || ''}" class="class-professor" data-period="${period}"></td>
            <td><input type="checkbox" class="class-major" data-period="${period}" ${classForPeriod?.isMajor ? 'checked' : ''}> 전공</td>
            <td><button class="delete-btn" data-period="${period}">삭제</button></td>
        `;
        
        timetableBody.appendChild(row);
    }
    
    // 이벤트 리스너 추가
    attachEventListeners();
}

// 강의 정보 입력 이벤트
function attachEventListeners() {
    // 강의명 입력
    document.querySelectorAll('.class-name').forEach(input => {
        input.addEventListener('input', function() {
            const period = parseInt(this.dataset.period);
            updateClass(period, 'name', this.value);
        });
    });
    
    // 강의실 입력
    document.querySelectorAll('.class-room').forEach(input => {
        input.addEventListener('input', function() {
            const period = parseInt(this.dataset.period);
            updateClass(period, 'room', this.value);
        });
    });
    
    // 교수 입력
    document.querySelectorAll('.class-professor').forEach(input => {
        input.addEventListener('input', function() {
            const period = parseInt(this.dataset.period);
            updateClass(period, 'professor', this.value);
        });
    });
    
    // 전공 체크박스
    document.querySelectorAll('.class-major').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const period = parseInt(this.dataset.period);
            updateClass(period, 'isMajor', this.checked);
        });
    });
    
    // 삭제 버튼
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const period = parseInt(this.dataset.period);
            deleteClass(period);
        });
    });
}

// 강의 정보 업데이트
function updateClass(period, field, value) {
    let classObj = classes.find(c => c.period === period);
    
    if (!classObj) {
        classObj = { period: period, name: '', room: '', professor: '', isMajor: false };
        classes.push(classObj);
    }
    
    classObj[field] = value;
    
    // 모든 필드가 비어있으면 제거
    if (!classObj.name && !classObj.room && !classObj.professor && !classObj.isMajor) {
        classes = classes.filter(c => c.period !== period);
    }
}

// 강의 삭제
function deleteClass(period) {
    classes = classes.filter(c => c.period !== period);
    renderTimetable();
}

// 초기화
renderTimetable();
