// 텍스트 Input
const text = document.getElementById("text");
// 텍스트 저장 버튼
const textBtn = document.getElementById("textBtn");

// 투두 리스트 상태 리스트
const statusFilters = document.querySelectorAll(
  ".todo-filters > ul > li > span"
);

// 투두리스트 목록 Ul
const todoList = document.getElementById("todo-list");

// 투두 리스트 담을 빈 배열
let todos = [];
let checkEdit = false;
let editId;

// 로컬 스토리지에 내용이 없으면 빈배열, 있으면 todos에 넣음
if (localStorage.getItem("todo-list") !== null) {
  todos = JSON.parse(localStorage.getItem("todo-list"));
} else {
  todos = [];
}

// Filter 초기화 함수
const commonFilterFunc = () => {
  // Filter active 최기화
  document
    .querySelector(".todo-filters > ul > li > span.active")
    .classList.remove("active");

  document
    .querySelector(".todo-filters > ul > li > span:nth-child(1)")
    .classList.add("active");
};

// 텍스트 저장 공통 함수
const commonTextFunc = () => {
  if (text.value !== "") {
    if (checkEdit) {
      checkEdit = false;
      todos[editId].content = text.value;
      localStorage.setItem("todo-list", JSON.stringify(todos));

      // Filter active 최기화
      commonFilterFunc();
    } else {
      const write = {
        content: text.value,
        status: "pending",
      };
      todos.push(write);
      localStorage.setItem("todo-list", JSON.stringify(todos));

      // Filter active 최기화
      commonFilterFunc();
    }
    // 텍스트 초기화
    text.value = "";
  } else {
    text.focus();
    window.alert("할 일을 적어주세요~");
  }
  showTodoList("all");
};

// 엔터 입력시 텍스트 저장
text.addEventListener("keyup", (e) => {
  e.preventDefault();

  if (e.key === "Enter") {
    // 텍스트 저장 함수
    commonTextFunc();
  }
});

// 버튼 클릭시 텍스트 저장
textBtn.addEventListener("click", async () => {
  //  연속 클릭 방지
  await new Promise((r) => setTimeout(r, 500));

  //   텍스트 저장 함수
  commonTextFunc();
});

// Filter 클릭 시 클래스 추가 및 제거
statusFilters.forEach((btn) => {
  btn.addEventListener("click", () => {
    text.value = "";

    const activeFilter = document.querySelector(
      ".todo-filters > ul > li > span.active"
    );
    if (activeFilter !== null) {
      activeFilter.classList.remove("active");
    }

    btn.classList.add("active");

    showTodoList(btn.id);
  });
});

// todos 목록 상태를 받아와서 li 생성
const showTodoList = (filter) => {
  let li = "";

  if (todos) {
    todos.forEach((todo, idx) => {
      // input checked 확인
      let completed = todo.status === "completed" ? "checked" : "";

      if (filter === todo.status || filter === "all") {
        li += `
                  <li key="${idx}"}>
                      <label>
                          <input type="checkbox" ${completed} onClick="onClickList(this)" id="${idx}"  />
                          <p>${todo.content}</p>
                      </label>
                      <div class="todo-list-btn">
                      <span onClick="onClickEdit('${todo.content}',${idx})">수정</span>
                      <span onClick="onClickDelete(${idx})">삭제</span>
                      </div>
                   </li>
                   `;
      }
    });

    // ul에 li 넣기
    todoList.innerHTML = li || `<p class="no-plan">할 일이 없습니다...</p>`;
  }
};
// 처음 렌더링시 전체 투두 리스트 보여줌
showTodoList("all");

//할 일 목록 클릭 시 status 상태 변경 후 locastorage에 다시 저장
const onClickList = (selected) => {
  // 인덱스 넘버 저장
  const selectedNumber = Number(selected.id);

  //   checked true시 성공, false시 대기 -> todos[인덱스] 상태 변경 후 로컬스토리지에 저장
  if (selected.checked) {
    todos[selectedNumber].status = "completed";
  } else {
    todos[selectedNumber].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
};

// 투두리스트 수정
const onClickEdit = (contnet, id) => {
  text.value = contnet;
  checkEdit = true;
  editId = id;
};

// 투두리스트 삭제
const onClickDelete = (id) => {
  if (window.confirm("삭제 하실껀가요..?")) {
    // 해당 인덱스 삭제
    todos.splice(id, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));

    // Filter active 최기화
    commonFilterFunc();

    showTodoList("all");
  } else {
    return;
  }
};
