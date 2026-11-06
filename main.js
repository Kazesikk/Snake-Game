const {app,BrowserWindow,Menu,shell,dialog}=require('electron');
const {autoUpdater}=require('electron-updater');
const path=require('path');

function create(){
  const w=new BrowserWindow({
    width:600,height:900,minWidth:400,minHeight:640,
    backgroundColor:'#0b1510',title:'Snake',
    icon:path.join(__dirname,'build','icon.png'),
    autoHideMenuBar:true,
    webPreferences:{contextIsolation:true,sandbox:true}
  });
  Menu.setApplicationMenu(null);
  w.loadFile('index.html');
  // F11 toggles full screen, Esc leaves it
  w.webContents.on('before-input-event',(e,i)=>{
    if(i.type!=='keyDown')return;
    if(i.key==='F11'){w.setFullScreen(!w.isFullScreen());e.preventDefault()}
    else if(i.key==='Escape'&&w.isFullScreen()){w.setFullScreen(false)}
  });
  w.webContents.setWindowOpenHandler(({url})=>{shell.openExternal(url);return{action:'deny'}});
}
function checkForUpdates(){
  if(!app.isPackaged)return;
  autoUpdater.on('update-downloaded',()=>{
    dialog.showMessageBox({type:'info',buttons:['Restart now','Later'],defaultId:0,
      message:'A new version of Snake is ready.',detail:'Restart to finish updating.'})
      .then(r=>{if(r.response===0)autoUpdater.quitAndInstall()});
  });
  autoUpdater.checkForUpdates().catch(()=>{});
}
app.whenReady().then(()=>{create();checkForUpdates()});
app.on('window-all-closed',()=>app.quit());
