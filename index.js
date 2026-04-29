const ASSET_GENERATOR_JSON = "https://raw.githubusercontent.com/KhronosGroup/glTF-Asset-Generator/master/Output/Positive/Manifest.json";
const ASSET_GENERATOR_REPOSITORY = "https://github.com/KhronosGroup/glTF-Asset-Generator";
const ASSET_GENERATOR_RAW_BASE_URL = "https://raw.githubusercontent.com/KhronosGroup/glTF-Asset-Generator";
const ENGINE_BASE_URL = 'https://cx20.github.io/gltf-test';

let engines = [{
    name: 'Three.js',
    path: ENGINE_BASE_URL + '/examples/threejs/index.html'
}, {
    name: 'Babylon.js',
    path: ENGINE_BASE_URL + '/examples/babylonjs/index.html'
}, {
    name: 'Filament',
    path: ENGINE_BASE_URL + '/examples/filament/index.html'
}, {
    name: 'PlayCanvas',
    path: ENGINE_BASE_URL + '/examples/playcanvas/index.html'
}, {
    name: 'Cesium',
    path: ENGINE_BASE_URL + '/examples/cesium/index.html'
}, {
    name: 'ArcGISJSAPI',
    path: ENGINE_BASE_URL + '/examples/arcgisjsapi/index.html'
}, {
    name: 'AMAPJSAPI',
    path: ENGINE_BASE_URL + '/examples/amapjsapi/index.html'
}, {
    name: 'Grimore.js',
    path: ENGINE_BASE_URL + '/examples/grimoiregl/index.html'
}, {
    name: 'xeogl',
    path: ENGINE_BASE_URL + '/examples/xeogl/index.html'
}, {
    name: 'minimal-gltf-loader',
    path: ENGINE_BASE_URL + '/examples/minimal-gltf-loader/index.html'
}, {
    name: 'Khronos glTF Viewer',
    path: ENGINE_BASE_URL + '/examples/khronos-gltf-rv/index.html'
}, {
    name: 'ClayGL',
    path: ENGINE_BASE_URL + '/examples/claygl/index.html'
}, {
    name: 'Hilo3d',
    path: ENGINE_BASE_URL + '/examples/Hilo3d/index.html'
}, {
    name: 'X3DOM',
    path: ENGINE_BASE_URL + '/examples/x3dom/index.html'
}, {
    name: 'CZPG.js',
    path: ENGINE_BASE_URL + '/examples/czpg/index.html'
}, {
    name: 'GLBoost',
    path: ENGINE_BASE_URL + '/examples/glboost/index.html'
}, {
    name: 'RedCube.js',
    path: ENGINE_BASE_URL + '/examples/redcube/index.html'
}, {
    name: 'RedGL',
    path: ENGINE_BASE_URL + '/examples/redgl2/index.html'
}, {
    name: 'Ashes',
    path: ENGINE_BASE_URL + '/examples/ashes3d/index.html'
}, {
    name: 'Unity',
    path: ENGINE_BASE_URL + '/examples/unity/index.html'
}, {
    name: 'pex',
    path: ENGINE_BASE_URL + '/examples/pex/index.html'
}, {
    name: 'Rhodonite',
    path: ENGINE_BASE_URL + '/examples/rhodonite/index.html'
}];

let json = "";
let jsonUrl = ASSET_GENERATOR_JSON;
$.getJSON(jsonUrl, function(data) {
    json = data;
    queryEngines();
    makeTables();
});


function queryEngines(){
    let res = location.search.match(/engines=([\w\.,]+)/);
    if(res && res[1]){
        let engineDict = {};
        engines.forEach(function(engine){
            engineDict[engine.name] = engine;
        });

        engines = [];
        res[1].split(',').forEach(function(engineName){
            let engine = engineDict[engineName];
            if(engine){
                engines.push(engine);
            }
        });
    }
}

function makeTables() {
    var element = document.getElementById("content");

    // Build Bootstrap nav tabs and tab content containers.
    var navTabs = document.createElement('ul');
    navTabs.className = "nav nav-tabs";
    navTabs.setAttribute('role', 'tablist');
    navTabs.id = "gltfTab";

    var tabContent = document.createElement('div');
    tabContent.className = "tab-content";
    tabContent.id = "gltfTabContent";

    element.appendChild(navTabs);
    element.appendChild(tabContent);

    // Allow a folder to be preselected via ?tab=FolderName
    var preselect = null;
    var tabRes = location.search.match(/[?&]tab=([\w\.\-]+)/);
    if (tabRes && tabRes[1]) {
        preselect = decodeURIComponent(tabRes[1]);
    }

    for (let i = 0; i < json.length; ++i) {
        let dataSet = json[i];
        let isActive = preselect ? (dataSet.folder === preselect) : (i === 0);
        makeTab(dataSet, i, isActive, navTabs, tabContent);
    }

    // Fallback: if no tab matched the preselect, activate the first.
    if (preselect && !navTabs.querySelector('.nav-link.active')) {
        var firstLink = navTabs.querySelector('.nav-link');
        var firstPane = tabContent.querySelector('.tab-pane');
        if (firstLink) firstLink.classList.add('active');
        if (firstPane) firstPane.classList.add('show', 'active');
    }
}

function makeTab(dataSet, index, isActive, navTabs, tabContent) {
    let folder = dataSet.folder;
    let tabId = "tab-" + index + "-" + folder.replace(/[^\w\-]/g, '_');

    // Nav item
    var li = document.createElement('li');
    li.className = "nav-item";
    var a = document.createElement('a');
    a.className = "nav-link" + (isActive ? " active" : "");
    a.setAttribute('data-toggle', 'tab');
    a.setAttribute('href', '#' + tabId);
    a.setAttribute('role', 'tab');
    a.textContent = folder;
    li.appendChild(a);
    navTabs.appendChild(li);

    // Tab pane
    var pane = document.createElement('div');
    pane.className = "tab-pane fade" + (isActive ? " show active" : "");
    pane.id = tabId;
    pane.setAttribute('role', 'tabpanel');

    // Link to the folder's README.md on glTF-Asset-Generator.
    var descP = document.createElement('p');
    descP.className = "mt-2";
    var descA = document.createElement('a');
    var readmeUri = ASSET_GENERATOR_REPOSITORY + "/blob/main/Output/Positive/" + folder + "/README.md";
    descA.setAttribute('href', readmeUri);
    descA.setAttribute('target', '_blank');
    descA.setAttribute('rel', 'noopener');
    descA.textContent = folder;
    descP.appendChild(descA);
    pane.appendChild(descP);

    var table = document.createElement('table');
    table.className = "table table-bordered table-sm table-striped";

    table.appendChild(makeTableHead(dataSet));
    table.appendChild(makeTableBody(dataSet));

    pane.appendChild(table);
    tabContent.appendChild(pane);
}

function makeTableHead(dataSet) {
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.textContent = "Model";
    tr.appendChild(th);

    var th2 = document.createElement('th');
    th2.textContent = "Screenshot";
    tr.appendChild(th2);
    for (let i = 0; i < engines.length; i++) {
        var th = document.createElement('th');
        let engine = engines[i];
        th.textContent = engine.name;
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    return thead;
}

function makeTableBody(dataSet) {
    var tbody = document.createElement('tbody');
    let folder = dataSet.folder;
    for (let i = 0; i < dataSet.models.length; i++) {
        let model = dataSet.models[i];
        let fileName = model.fileName;
        var tr = document.createElement('tr');
        var td = document.createElement('td');

        let a = document.createElement('a');
        // https://github.com/KhronosGroup/glTF-Asset-Generator/blob/master/Output/Positive/Compatibility/Compatibility_00.gltf
        let uri = ASSET_GENERATOR_REPOSITORY + "/blob/master/Output/Positive/" + folder + "/" + fileName;
        a.textContent = fileName;
        a.title = fileName;
        a.setAttribute('href', uri);
        a.setAttribute('target', '_blank');
        td.appendChild(a);
        tr.appendChild(td);

        // https://raw.githubusercontent.com/KhronosGroup/glTF-Asset-Generator/master/Output/Positive/Animation_Node/Figures/SampleImages/Animation_Node_00.gif
        let sampleImageName = model.sampleImageName;
        let imageUri = ASSET_GENERATOR_RAW_BASE_URL + "/master/Output/Positive/" + folder + "/" + sampleImageName;
        var tdPic = document.createElement('td');
        if (folder != "Compatibility") {
            let img = document.createElement('img');
            img.setAttribute('src', imageUri);
            img.setAttribute('width', 128);
            img.setAttribute('height', 128);
            tdPic.appendChild(img);
        }
        tr.appendChild(tdPic);

        for (let j = 0; j < engines.length; j++) {
            var td = document.createElement('td');

            let engine = engines[j];
            let name = engine.name;
            let path = engine.path;
            let a = document.createElement('a');
            // https://raw.githubusercontent.com/KhronosGroup/glTF-Asset-Generator/master/Output/Positive/Accessor_Sparse/Accessor_Sparse_02.gltf
            let uri = path + "?url=" + ASSET_GENERATOR_RAW_BASE_URL + "/master/Output/Positive/" + folder + "/" + fileName + "&scale=3.0";
            a.textContent = "View";
            a.title = name + " : " + fileName;
            a.setAttribute('href', uri);
            a.setAttribute('target', '_blank');
            td.appendChild(a);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    return tbody;
}
