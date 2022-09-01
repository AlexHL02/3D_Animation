

//variable declaration section
let physicsWorld, scene, camera, renderer, rigidBodies = [];
let colGroupPlane = 1, colGroupRedBall = 2, colGroupGreenBall = 4;




//Ammojs Initialization
Ammo().then(start);

function start() {

    tmpTrans = new Ammo.btTransform();
    
    setupPhysicsWorld();

    setupGraphics();
    createBlock1();
    createBlock2();
    createBlock3();
    createBlock4();
  //  createBlock0();
    createBlock00();
    let k = 50;
    //Math.floor((Math.random()*15)+10)
    createBallF(Math.floor((Math.random()*15)+20),Math.floor((Math.random()*15)+20), 800, 3, Math.floor((Math.random() * 50) + 50));
    createBallF(-Math.floor((Math.random()*15)+20),10, 700, 3, Math.floor((Math.random() * 50) + 50));
    createBallF(10,-Math.floor((Math.random()*15)+20), 600, 3, Math.floor((Math.random() * 50) + 50));
    createBallF(-Math.floor((Math.random()*15)+20),-Math.floor((Math.random()*15)+20), 500, 3, Math.floor((Math.random() * 50) + 50));
    createBallF(0,0,400,3,150);
  
    for (let i = -60; i < 41; i += 4) {
        for (let j = -60; j < 41; j += 4) {
                createBall(i, j, k, 3, 2);
        }
    }
    for (let i = -28; i < 23; i += 4) {
        for (let j = -28; j < 23; j += 4) {
            createMaskBall(i, j,k+5, 3);
        }
    }

    //    createJointObjects();

    renderFrame();

}

function setupPhysicsWorld() {

    let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
        overlappingPairCache = new Ammo.btDbvtBroadphase(),
        solver = new Ammo.btSequentialImpulseConstraintSolver();

    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -9.81, 0));

}


function setupGraphics() {

    //create clock for timing
    clock = new THREE.Clock();

    //create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1e5);

    //create camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 5000);
    camera.position.set(140, 100, 140);

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //Add hemisphere light
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
    hemiLight.color.setHSL(0.6, 0.6, 0.6);
    hemiLight.groundColor.setHSL(0.1, 1, 0.4);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    //Add directional light
    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(1000);
    scene.add(dirLight);

//    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 3000;
    dirLight.shadow.mapSize.height = 3000;

    let d = 200;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 10000;

    //Setup the renderer
    renderer = new THREE.WebGLRenderer({canvas: GM,antialias: true });
    renderer.setClearColor(0xbfd1e5);
    renderer.setPixelRatio(window.devicePixelRatio);
    //console.log(window.devicePixelRatio);
   // renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9,false);
    //document.body.appendChild(renderer.domElement);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.shadowMap.enabled = true;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }


function renderFrame() {

    updatePhysics(clock.getDelta());
    
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

    
   
    renderer.render(scene, camera);

    requestAnimationFrame(renderFrame);

}




function createBlock1() {

    let pos = { x: 0, y: -190, z: -1000 };
    let scale = { x: 2000, y: 4, z: 30 };
    let quat = { x: 1, y: 0, z: 0, w: 1 };
    let mass = 0;

    //threeJS Section
    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0x0000ff /*0xa0afa4*/, shininess: 50 }));


    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    blockPlane.rotation.x = THREE.MathUtils.degToRad(90);
    scene.add(blockPlane);

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
    let body = new Ammo.btRigidBody(rbInfo);
    body.setFriction(0.9);
    physicsWorld.addRigidBody(body, colGroupPlane, colGroupRedBall | colGroupGreenBall);
}

function createBlock2() {

    let pos = { x: 0, y: -190, z: 1000 };
    let scale = { x: 2000, y: 4, z: 30 };
    let quat = { x: 1, y: 0, z: 0, w: 1 };
    let mass = 0;

    //threeJS Section
    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0x0000ff /*0xa0afa4*/, shininess: 50 }));


    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    blockPlane.rotation.x = THREE.MathUtils.degToRad(90);
    scene.add(blockPlane);


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
    let body = new Ammo.btRigidBody(rbInfo);
    body.setFriction(0.9);
    physicsWorld.addRigidBody(body, colGroupPlane, colGroupRedBall | colGroupGreenBall);
}

function createBlock3() {

    let pos = { x: -1000, y: -190, z: 0 };
    let scale = { x: 2002, y: 4, z: 30 };
    let quat = { x: 0, y: 0, z: 1, w: 1 };
    let mass = 0;

    //threeJS Section
    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0x0000ff /*0xa0afa4*/, shininess: 50 }));


    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    blockPlane.rotation.x = THREE.MathUtils.degToRad(90);
    blockPlane.rotation.z = THREE.MathUtils.degToRad(90);
    scene.add(blockPlane);


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btBoxShape(new Ammo.btVector3(/*scale.x*/30 * 0.5, scale.y * 0.5, /*scale.z*/2000 * 0.5));
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
    let body = new Ammo.btRigidBody(rbInfo);
    body.setFriction(0.9);
    physicsWorld.addRigidBody(body, colGroupPlane, colGroupRedBall | colGroupGreenBall);
}

function createBlock4() {

    let pos = { x: 1000, y: -190, z: 0 };
    let scale = { x: 2002, y: 4, z:30 };
    let quat = { x: 0, y: 0, z: 1, w: 1 };
    let mass = 0;

    //threeJS Section
    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0x0000ff /*0xa0afa4*/, shininess: 50 }));


    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    blockPlane.rotation.x = THREE.MathUtils.degToRad(90);
    blockPlane.rotation.z = THREE.MathUtils.degToRad(90);
    scene.add(blockPlane);


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btBoxShape(new Ammo.btVector3(/*scale.x*/30 * 0.5, scale.y * 0.5, (scale.z+1990) * 0.5));
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
    let body = new Ammo.btRigidBody(rbInfo);
    body.setFriction(0.9);
    physicsWorld.addRigidBody(body, colGroupPlane, colGroupRedBall | colGroupGreenBall);
}

function createBlock0() {

    let pos = { x: 0, y: -170, z: 0 };
    let scale = { x: 200, y: 50, z: 200 };
    let quat = { x: 0, y: 0, z: 0, w: 1 };
    let mass = 0;

    //threeJS Section
    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xA3AF28 /*0xa0afa4*/, shininess: 0 }));


    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;

    scene.add(blockPlane);


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
    colShape.setMargin(0.05);
    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
    let body = new Ammo.btRigidBody(rbInfo);
    physicsWorld.addRigidBody(body, colGroupPlane, colGroupRedBall || colGroupGreenBall);
}
function createBlock00() {

    let pos = { x: 0, y: -200, z: 0 };
    let scale = { x: 2000, y: 5, z: 2000 };
    let quat = { x: 0, y: 0, z: 0, w: 1 };
    let mass = 0;

    //threeJS Section
    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xD4AF37 /*0xa0afa4*/, shininess: 0 }));


    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;

    scene.add(blockPlane);


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
    colShape.setMargin(0.05);
    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
    let body = new Ammo.btRigidBody(rbInfo);
    physicsWorld.addRigidBody(body, colGroupPlane, colGroupRedBall || colGroupGreenBall);
}
function createBall(X, Z, Y, group, Mass) {

    let pos = { x: X, y: Y, z: Z };
    let radius = 2;
    let quat = { x: 0, y: 0, z: 0, w: 1 };
    let mass = Mass;

    //threeJS Section
    const matrix = new THREE.Matrix4();
    let ball = new THREE.Mesh(new THREE.SphereBufferGeometry(radius), new THREE.MeshPhongMaterial({ color: 0xff0505, shininess: 100 }));

    ball.position.set(pos.x, pos.y, pos.z);

    ball.castShadow = true;
    ball.receiveShadow = true;

    scene.add(ball);


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btSphereShape(radius);
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
    let body = new Ammo.btRigidBody(rbInfo);
 //   body.setFriction(0.74);
    body.setDamping(0,0.24);
    physicsWorld.addRigidBody(body, group, colGroupPlane ||colGroupRedBall || colGroupGreenBall);

    ball.userData.physicsBody = body;
    rigidBodies.push(ball);
}

function createBallF(X, Z, Y, group, Mass) {

    let pos = { x: X, y: Y, z: Z };
    let radius = 15;
    let quat = { x: 0, y: 0, z: 0, w: 1 };
    let mass = Mass;

    //threeJS Section
    let ball = new THREE.Mesh(new THREE.SphereBufferGeometry(radius), new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 }));

    ball.position.set(pos.x, pos.y, pos.z);

    ball.castShadow = true;
    ball.receiveShadow = true;

    scene.add(ball);


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btSphereShape(radius);
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
    let body = new Ammo.btRigidBody(rbInfo);
//    body.setFriction(0.84);
    body.setDamping(0,0.84);
    body.setLinearVelocity(new Ammo.btVector3(0,-600,0));
    physicsWorld.addRigidBody(body,group, colGroupPlane);

    ball.userData.physicsBody = body;
    rigidBodies.push(ball);
}

function createMaskBall(X, Z, Y, group) {

    let pos = { x: X, y: Y, z: Z };
    let radius = 2;
    let quat = { x: 0, y: 0, z: 0, w: 1 };
    let mass = 4;

    //threeJS Section
    let ball = new THREE.Mesh(new THREE.SphereBufferGeometry(radius), new THREE.MeshPhongMaterial({ color: 0x00ff08 }));

    ball.position.set(pos.x, pos.y, pos.z);

    ball.castShadow = true;
    ball.receiveShadow = true;

    scene.add(ball);


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btSphereShape(radius);
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
    let body = new Ammo.btRigidBody(rbInfo);
  //  body.setFriction(0.74);
    body.setDamping(0,0.24);
    physicsWorld.addRigidBody(body, group, colGroupPlane ||colGroupRedBall || colGroupGreenBall);

    ball.userData.physicsBody = body;
    rigidBodies.push(ball);
}



function updatePhysics(deltaTime) {

    // Step world
    physicsWorld.stepSimulation(deltaTime, 5);

    // Update rigid bodies
    for (let i = 0; i < rigidBodies.length; i++) {
        let objThree = rigidBodies[i];
        let objAmmo = objThree.userData.physicsBody;
        
        let ms = objAmmo.getMotionState();
        if (ms) {
            
            ms.getWorldTransform(tmpTrans);
            let p = tmpTrans.getOrigin();
            let q = tmpTrans.getRotation();
            if(p.x()<-1000||p.x()>1000)
            {
                p.setX(0);
            }
            if(p.z()>1000||p.z()<-1000)
            {
                p.setZ(0);
            }

            if(p.y()<=-200)
            {
                p.setY(-200);
                   
            }
                
            objThree.position.set(p.x(), p.y(), p.z());
            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            
        }
    }
}

/*
const scene= new THREE.Scene();
const camera= new THREE.PerspectiveCamera(75, 650/400, 0.1, 1000);

//renderer
const renderer= new THREE.WebGLRenderer({alpha:true});
renderer.setSize(650,400);
renderer.setClearColor(0x00ff00,0.1);
document.body.appendChild(renderer.domElement);

//würfel 
const geometry= new THREE.BoxGeometry(10, 10,10);
const material= new THREE.MeshMatcapMaterial({color:0xff0000});
const cube = new THREE.Mesh(geometry,material);
cube.position.x=5;
cube.position.z=10;
cube.position.y=55;
scene.add(cube);

const gekugel= new THREE.SphereGeometry(5,64,32);
const materialK= new THREE.MeshMatcapMaterial({color:0xff00A5});
const kugel= new THREE.Mesh(gekugel,materialK);
scene.add(kugel);
kugel.position.x=-5;
kugel.position.z=-10;
kugel.position.y=10;

const geometryU= new THREE.BoxGeometry(500, 10,500);
const materialU= new THREE.MeshMatcapMaterial({color:0x003300});
const cubeU = new THREE.Mesh(geometryU,materialU);
cubeU.position.x=0;
cubeU.position.z=0;
cubeU.position.y=-5;
scene.add(cubeU);



//mouse controls
controls = new THREE.OrbitControls( camera, renderer.domElement );

//axes anzeige
const axesHelper = new THREE.AxesHelper( 20);
scene.add( axesHelper );



//Grid anzeigen size=größe des grids divisions=anzahl der viere ecke
const size = 500;
const divisions=500;
const gridHelper= new THREE.GridHelper(size,divisions);
scene.add(gridHelper);




camera.position.x=00;
camera.position.y=50;
camera.position.z=80;
controls.update();

function animate()
{
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);
}


window.onload= animate;
*/