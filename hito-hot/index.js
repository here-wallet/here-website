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
	var engine = new BABYLON.Engine(canvas, true, { alpha: true });

	var createScene = function() {
		var scene = new BABYLON.Scene(engine);
	
		// Создаем сферу для фона
		var backgroundSphere = BABYLON.MeshBuilder.CreateSphere("backgroundSphere", { diameter: 100 }, scene);
		backgroundSphere.material = new BABYLON.StandardMaterial("backgroundMaterial", scene);
		backgroundSphere.material.diffuseColor = new BABYLON.Color3(14/255, 15/255, 18/255); // Цвет 0E0F12 
		backgroundSphere.material.backFaceCulling = false;
	
		// Установка цвета фона сцены
		scene.clearColor = new BABYLON.Color4(14, 15, 18, 1); // Прозрачный цвет
	
		// Создаем камеру ArcRotateCamera
		var camera = new BABYLON.ArcRotateCamera("camera", 1.7338, 1.3663, 1.7867, new BABYLON.Vector3(0, 0.80, 0.31), scene);
		camera.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;
		camera.fov = 0.8;
		camera.minZ = 0.0209;
		camera.maxZ = 2085.3106;
	
		// Настройки управления камерой
		camera.angularSensibilityX = 200.0000;
		camera.angularSensibilityY = 200.0000;
		camera.panningSensibility = 3596.5866;
		camera.pinchDeltaPercentage = 0.0100;
		camera.wheelDeltaPercentage = 0.0100;
		camera.speed = 0.4171;
	
		// Отключаем инерцию
		camera.inertia = 0;
	
		// Ограничения камеры
		camera.lowerBetaLimit = 0.0100;
		camera.upperBetaLimit = 3.1316;
		camera.lowerRadiusLimit = 0.7160;
		camera.upperRadiusLimit = 8.9249;
	
		// Включаем фрейминг
		camera.useFramingBehavior = true;
	
		camera.attachControl(canvas, true);
	
		// Создаем источник света
		var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
		light.intensity = 0.7;
	
		// Добавляем настройки для окружения
		scene.clearColor = new BABYLON.Color4(51/255, 51/255, 77/255, 1); // Clear color - HEX (33334DFF)
		scene.ambientColor = new BABYLON.Color3(0, 0, 0); // Ambient color - HEX (000000FF)
	
		// Добавляем текстуру окружения (IBL)
		var hdrTexture = new BABYLON.CubeTexture("https://assets.babylonjs.com/environments/environmentSpecular.env", scene);
		scene.environmentTexture = hdrTexture; // Env. texture - https://assets.babylonjs.com/environments/environmentSpecular.env
	
		// Добавляем настройки для IBL
		scene.imageProcessingConfiguration.environmentIntensity = 1.0;
		scene.imageProcessingConfiguration.exposure = 1.0; // Setting for mode - none
	
		// Добавляем настройки для обработки изображений материалов
		scene.imageProcessingConfiguration.contrast = 1.0;
		scene.imageProcessingConfiguration.exposure = 1.0;
		scene.imageProcessingConfiguration.toneMappingEnabled = false;
		scene.imageProcessingConfiguration.vignetteEnabled = false;
		scene.imageProcessingConfiguration.vignetteWeight = 1.5;
		scene.imageProcessingConfiguration.vignetteStretch = 0;
		scene.imageProcessingConfiguration.vignetteFOV = 0.5;
		scene.imageProcessingConfiguration.vignetteBlendMode = BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY;
		scene.imageProcessingConfiguration.vignetteColor = new BABYLON.Color4(0, 0, 0, 1);
		scene.imageProcessingConfiguration.ditheringEnabled = false;
		scene.imageProcessingConfiguration.ditheringScale = 0.0039;
	
		// Добавляем настройки для коллизий
		scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
	
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
	// Предотвращаем прокрутку страницы при использовании колеса мыши для управления моделью
    canvas.addEventListener("wheel", function(event) {
        event.preventDefault();
    });
};