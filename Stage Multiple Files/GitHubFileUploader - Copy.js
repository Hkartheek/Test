importPackage(java.io);
importPackage(org.eclipse.jgit.transport);
importPackage(org.apache.commons.io);
importPackage(org.eclipse.jgit.api);
importPackage(java.lang);
importPackage(org.eclipse.jgit.internal.storage.file);
importPackage(org.json);


/** 
 * Function execute is the starting point 
 * Kick Start: 
 * Import Package using: importPackage 
 */ 

var debug = new StringBuffer();
function execute() {
    var bitBucketURL = vGItHubUrl;
    var userName = vUserName;
    var password = vPassword;
    var repoFolderName = vFolderName;
    var uploadFilePath;
    var localFileDirPath;
    var fileName;

    var jsonarray = new JSONArray(vUpload);
    for (var k1 = 0; k1 < jsonarray.length();
         k1++) {
        var jsonobject = jsonarray.getJSONObject(k1);
        localFileDirPath = jsonobject.getString("serverName");
        fileName = localFileDirPath;
        localFileDirPath = localFileDirPath.substring(0,localFileDirPath.lastIndexOf("/")+1);
    }
    var file = new File(fileName);
    var filename = file.getName();
    var fileContent = FileUtils.readFileToString(file);
    localFileDirPath = localFileDirPath+repoFolderName;
    var localPath = new File(localFileDirPath);
    uploadFileIntoGitHub(bitBucketURL, userName, password, localPath, repoFolderName,fileContent,filename);
    return debug.toString();

}

function uploadFileIntoGitHub( bitBucketURL,userName, password, localFileDirPath, folderName,fileConent,fileName) {
    try {

        var branch ="master";
        var remote = "origin";
        var git = Git.cloneRepository().setURI(bitBucketURL).setCredentialsProvider(new UsernamePasswordCredentialsProvider(userName, password))
        .setDirectory(localFileDirPath)
        .call();
        var repository = git.getRepository();
        var spec = new RefSpec(branch + ":" + branch);
        var theDir = new File(repository.getDirectory().getParent(), folderName);
        if (!theDir.exists()) {
            theDir.mkdir();
        }
        var myfile = new File(theDir, fileName);
        var writer = new FileWriter(myfile);
        writer.write(fileConent);

        writer.close();
        git.add().addFilepattern(".").call();
        git.commit().setMessage("Commit all changes including additions").call();

        git.commit().setAll(true).setMessage("Commit changes to all files").call();
        var result = git.commit().setMessage("initial commit").call();
        git.push().setCredentialsProvider(new UsernamePasswordCredentialsProvider(userName, password)).setRemote(remote).setRefSpecs(spec).call();
        System.out.println("Pushed with commit: " + result);
        debug.append("Pushed with commit: " + result);
        git.close();
    }
    catch (e) {
        e.printStackTrace();
        debug.append("Exception at uploadFileIntoGitHub() : " + e.getMessage());
    }
}