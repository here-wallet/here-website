const asks = Array.from(document.querySelectorAll(".faq-block"));
asks.forEach((el) => {
  el.addEventListener("click", () => {
    const header = el.querySelector(".faq-block-header");
    const body = el.querySelector(".faq-block-body");
    const headerBox = header.getBoundingClientRect();

    asks.forEach((ask) => {
      if (ask == el) return;
      const header = ask.querySelector(".faq-block-header");
      const box = header.getBoundingClientRect();
      ask.classList.remove("open");
      ask.style.height = box.height + "px";
    });

    el.style.height = headerBox.height + "px";
    body.style.display = "block";
    setTimeout(() => {
      const { height } = body.getBoundingClientRect();
      el.classList.toggle("open");
      el.style.height = el.classList.contains("open")
        ? `${headerBox.height + height}px`
        : headerBox.height + "px";
    }, 10);
  });
});

document.addEventListener("DOMContentLoaded", function() {
	const burgerClosetButton = document.querySelector(".burger-closet");
	const burgerOpenButton = document.querySelector(".burger-open");
	const headerBlock = document.querySelector(".header");
  
	// По клику на кнопку открываем меню
	burgerClosetButton.addEventListener("click", function() {
	  headerBlock.classList.add("active");
	});
  
	// По клику на кнопку закрываем меню
	burgerOpenButton.addEventListener("click", function() {
	  headerBlock.classList.remove("active");
	});
  });



  window.onload = function() {
	var canvas = document.getElementById("built-figure");
	var engine = new BABYLON.Engine(canvas, true);
	
	var createScene = function() {
	  var scene = new BABYLON.Scene(engine);
	  
	  // Камера
	  var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 1, -1), scene);
	  camera.setTarget(BABYLON.Vector3.Zero());
	  camera.attachControl(canvas, true);
	  
	  // Освещение
	  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
	  light.intensity = 0.7;
	  
	  // Загрузка и отображение 3D-модели
	  BABYLON.SceneLoader.Append("./hito-hot/images/", "hito-7.glb", scene, function(scene) {
		// Загрузка прошла успешно
	  });
	  
	  return scene;
	};
	
	var scene = createScene();
	
	engine.runRenderLoop(function() {
	  scene.render();
	});
	
	window.addEventListener("resize", function() {
	  engine.resize();
	});
  };