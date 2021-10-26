(() => {
  // 변수 모음

  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  let prevScrollHeight; // 현재 스크롤 위치 이전의 섹션들의 높이 합
  let currentScene = 0; // 현재 보고 있는 씬 scroll-section 몇 번째인지
  let enterNewScene = false; // 새로운 세션 시작된 순간 true

  const sceneInfo = [
    {
      // section 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
      },
      values: {
        messageA_opacity: [0, 1, { start: 0.1, end: 0.2 }], // 투명도 0 -> 1로 변화
        messageB_opacity: [0, 1, { start: 0.3, end: 0.4 }], // 구간 지정
      },
    },
    {
      // section 1
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      // section 2
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
      },
    },
    {
      // section 3
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
      },
    },
  ];

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      // 섹션의 높이를 html에 세팅
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= pageYOffset) {
        currentScene = i;
        break;
      }
    }
  }

  // 값이 변화되는 걸 계산
  // currentYOffset - 현재 섹션에서 얼마나 scroll되었는지 비율 계산
  function calcValues(values, currentYOffset) {
    let rv; // return value
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;

    // 범위에 따른 타이밍 조절
    if (values.length == 3) {
      // start ~ end 사이 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      rv =  * (values[1] - values[0]) + values[0];
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0]; // 0~1 -> 범위 확장    return rv;
    }
  }

  // 애니메이션 진행 처리 함수
  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight; // 현재 섹션에서 위치

    console.log(currentScene, currentYOffset);

    switch (currentScene) {
      case 0:
        // console.log('0 play');
        let messageA_opacity_in = calcValues(
          values.messageA_opacity,
          currentYOffset
        ); // start (in)
        objs.messageA.style.opacity = messageA_opacity_in;
        //console.log(messageA_opacity_in);
        break;
      case 1:
        // console.log('1 play');
        break;
      case 2:
        // console.log('2 play');
        break;
      case 3:
        // console.log('3 play');
        break;
    }
  }

  // "현재 활성시킬 스크롤 씬(세션) 결정하기"
  // 몇 번째 스크롤 섹션 진행중인지 check
  // 앞파트 스크롤 섹션의 height 합으로 계산 가능
  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0; // 값 누적 방지용 초기화
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
      // currentScene에 맞춰서 body에 하나씩 세팅된다
    }

    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene == 0) return; // 브라우저 바운스 효과로 음수 에러 방지
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
      // currentScene에 맞춰서 body에 하나씩 세팅된다
    }

    if (enterNewScene) return;

    playAnimation();

    console.log(currentScene); // 몇 번째 섹션인지
  }

  //window.addEventListener("resize", setLayout); // height에러 check
  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    //console.log(yOffset); // 스크롤 페이지 값
    scrollLoop();
  });
  // 새로고침
  window.addEventListener("load", setLayout);
  window.addEventListener("resize", setLayout);
  setLayout();
})();
