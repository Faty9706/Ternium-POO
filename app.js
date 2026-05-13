function login(){
  const usuarioActivo = localStorage.getItem("usuarioActivo");

if(!usuarioActivo){
   document.getElementById("loginContainer").style.display="flex";
   document.getElementById("appContainer").style.display="none";
}else{
   document.getElementById("loginContainer").style.display="none";
   document.getElementById("appContainer").style.display="block";
}
  actualizarDashboard();
}

function toggleMenu(){
  document.getElementById("sidebar").classList.toggle("hidden");
}

function mostrar(id){
  document.querySelectorAll(".modulo").forEach(m=>m.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* INCIDENCIAS */
function guardarIncidencia(){
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  const maquina = document.getElementById("maquina").value;
  const descripcion = document.getElementById("descripcion").value;
  const tipo = document.getElementById("tipo").value;
  const area = document.getElementById("area").value;

  const nuevaIncidencia = {
    id: Date.now(),
    maquina,
    descripcion,
    tipo,
    area,
    fecha: new Date().toLocaleDateString(),
    responsable: usuario.nombre,
    correoResponsable: usuario.correo
  };

  let incidencias = JSON.parse(localStorage.getItem("incidencias")) || [];
  incidencias.push(nuevaIncidencia);

  localStorage.setItem("incidencias", JSON.stringify(incidencias));
}

function mostrarTablaIncidencias(){
  const tabla=document.getElementById("tablaIncidencias");
  tabla.innerHTML="";
  const incidencias=JSON.parse(localStorage.getItem("incidencias"))||[];
  incidencias.forEach(i=>{
    tabla.innerHTML+=`<tr>
    <td>${i.usuario}</td>
    <td>${i.maquina}</td>
    <td>${i.fecha}</td>
    <td>${i.descripcion}</td>
    </tr>`;
  });
}

/* MANTENIMIENTOS */
function guardarMantenimiento(){
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  const maquina = document.getElementById("maquinaM").value;
  const descripcion = document.getElementById("descripcionM").value;

  const nuevoMantenimiento = {
    id: Date.now(),
    maquina,
    descripcion,
    fecha: new Date().toLocaleDateString(),
    responsable: usuario.nombre
  };

  let mantenimientos = JSON.parse(localStorage.getItem("mantenimientos")) || [];
  mantenimientos.push(nuevoMantenimiento);

  localStorage.setItem("mantenimientos", JSON.stringify(mantenimientos));
}

function mostrarTablaMantenimiento(){
  const tabla=document.getElementById("tablaMantenimientos");
  tabla.innerHTML="";
  const mantenimientos=JSON.parse(localStorage.getItem("mantenimientos"))||[];
  mantenimientos.forEach(m=>{
    tabla.innerHTML+=`<tr>
    <td>${m.usuario}</td>
    <td>${m.maquina}</td>
    <td>${m.tipo}</td>
    <td>${m.fecha}</td>
    <td>${m.descripcion}</td>
    </tr>`;
  });
}

/* DASHBOARD */
function actualizarDashboard(){
  const incidencias = JSON.parse(localStorage.getItem("incidencias")) || [];
  const mantenimientos = JSON.parse(localStorage.getItem("mantenimientos")) || [];
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  const ultimaIncidencia = incidencias.length > 0 ? incidencias[incidencias.length-1] : null;
  const ultimoMantenimiento = mantenimientos.length > 0 ? mantenimientos[mantenimientos.length-1] : null;

  document.getElementById("dashboard").innerHTML = `
    <h1>Dashboard</h1>

    <div class="cards">

      <div class="card">
        <h3>Incidencias registradas</h3>
        <p class="big">${incidencias.length}</p>
      </div>

      <div class="card">
        <h3>Mantenimientos realizados</h3>
        <p class="big">${mantenimientos.length}</p>
      </div>

      <div class="card">
        <h3>Usuario activo</h3>
        <p><b>${usuario.nombre}</b></p>
        <p>Rol: ${usuario.rol}</p>
      </div>

    </div>

    <div class="cards">

      <div class="card card-large">
   <h3>Última incidencia</h3>
        ${
          ultimaIncidencia
          ? `<p><b>${ultimaIncidencia.maquina}</b></p>
             <p>${ultimaIncidencia.descripcion}</p>
             <p>Registró: ${ultimaIncidencia.responsable}</p>`
          : "<p>No hay incidencias aún</p>"
        }
      </div>

      <div class="card card-large">
   <h3>Último mantenimiento</h3>
        ${
          ultimoMantenimiento
          ? `<p><b>${ultimoMantenimiento.maquina}</b></p>
             <p>${ultimoMantenimiento.descripcion}</p>
             <p>Responsable: ${ultimoMantenimiento.responsable}</p>`
          : "<p>No hay mantenimientos aún</p>"
        }
      </div>

    </div>
  `;
}
// ===== USUARIOS =====
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

function registrar(){
  const nombre = document.getElementById("nombreReg").value;
  const correo = document.getElementById("correoReg").value;
  const pass = document.getElementById("passReg").value;
  const rol = document.getElementById("rolReg").value;

  if(!nombre || !correo || !pass){
    alert("Completa todos los campos");
    return;
  }

  if(usuarios.find(u => u.correo === correo)){
    alert("Este correo ya está registrado");
    return;
  }

  const nuevo = {
    id: Date.now(),
    nombre,
    correo,
    pass,
    rol
  };

  usuarios.push(nuevo);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("Usuario creado correctamente 🎉");
}

function login(){
  const correo = document.getElementById("correoLogin").value;
  const pass = document.getElementById("passLogin").value;

  const user = usuarios.find(u => u.correo === correo && u.pass === pass);

  if(!user){
    alert("Credenciales incorrectas");
    return;
  }

  // Guardar sesión
  localStorage.setItem("usuarioActivo", JSON.stringify(user));

  entrarSistema();
}

// ===== ENTRAR AL SISTEMA =====
function entrarSistema(){
  document.getElementById("login").classList.add("hidden");
  document.getElementById("sidebar").classList.remove("hidden");
  document.getElementById("menuBtn").classList.remove("hidden");
  document.getElementById("dashboard").classList.remove("hidden");

  actualizarDashboard();
}

// Mantener sesión si ya estaba logueado
window.onload = () => {
  const sesion = JSON.parse(localStorage.getItem("usuarioActivo"));
  if(sesion){
    entrarSistema();
  }
};

function cerrarSesion(){
   if(confirm("¿Deseas cerrar sesión?")){
      localStorage.removeItem("usuarioActivo");
      location.reload();
   }
}
function guardarIncidencia(){

  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  if(!usuario){
    alert("No hay sesión activa");
    return;
  }

  const maquina = document.getElementById("maquina").value;
  const fecha = document.getElementById("fecha").value;
  const descripcion = document.getElementById("descripcion").value;

  if(!maquina || !fecha || !descripcion){
    alert("Completa todos los campos");
    return;
  }

  const nueva = {
    id: Date.now(),
    maquina,
    fecha,
    descripcion,
    usuario: usuario.nombre
  };

  let incidencias = JSON.parse(localStorage.getItem("incidencias")) || [];

  incidencias.push(nueva);

  localStorage.setItem("incidencias", JSON.stringify(incidencias));

  alert("Incidencia guardada ✅");

  // 🔥 IMPORTANTÍSIMO: refrescar vista
  mostrarTablaIncidencias();
  actualizarDashboard();
}
function guardarMantenimiento(){

  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  if(!usuario){
    alert("No hay sesión activa");
    return;
  }

  const maquina = document.getElementById("maqMant").value;
  const tipo = document.getElementById("tipoMant").value;
  const fecha = document.getElementById("fechaMant").value;
  const descripcion = document.getElementById("descMant").value;

  if(!maquina || !tipo || !fecha || !descripcion){
    alert("Completa todos los campos");
    return;
  }

  const nuevo = {
    id: Date.now(),
    maquina,
    tipo,
    fecha,
    descripcion,
    usuario: usuario.nombre
  };

  let mantenimientos = JSON.parse(localStorage.getItem("mantenimientos")) || [];

  mantenimientos.push(nuevo);

  localStorage.setItem("mantenimientos", JSON.stringify(mantenimientos));

  alert("Mantenimiento guardado ✅");

  mostrarTablaMantenimiento();
  actualizarDashboard();
}
