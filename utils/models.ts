import * as THREE from 'three';import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
export function validateGLB(buffer:ArrayBuffer){
 if(buffer.byteLength<20||buffer.byteLength>20*1024*1024)throw Error('Use GLB de até 20 MB.');
 const v=new DataView(buffer);if(v.getUint32(0,true)!==0x46546c67||v.getUint32(4,true)!==2||v.getUint32(8,true)!==buffer.byteLength)throw Error('Cabeçalho GLB 2.0 inválido.');
 const length=v.getUint32(12,true);if(length>1024*1024||length%4||20+length>buffer.byteLength||v.getUint32(16,true)!==0x4e4f534a)throw Error('Bloco JSON GLB inválido.');
 const doc=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,20,length)));if(doc.asset?.version!=='2.0')throw Error('Requer glTF 2.0.');
 for(const section of ['buffers','images']){if(doc[section]!==undefined&&!Array.isArray(doc[section]))throw Error('Estrutura GLB inválida.');for(const item of doc[section]??[]){if(item.uri!==undefined&&(typeof item.uri!=='string'||!/^data:(?:image\/(?:png|jpeg|webp)|application\/octet-stream);base64,[A-Za-z0-9+/]*={0,2}$/.test(item.uri)))throw Error('Exporte um GLB autocontido, sem URLs ou arquivos externos.');}}
 const unsupported=['KHR_draco_mesh_compression','EXT_meshopt_compression','KHR_texture_basisu'];if((doc.extensionsUsed??[]).some((x:string)=>unsupported.includes(x)))throw Error('Modelo com compressão não suportada nesta edição. Exporte sem Draco/Meshopt/KTX2.');
 return doc;
}
export function disposeScene(scene:THREE.Object3D){
 const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>(),skeletons=new Set<THREE.Skeleton>();
 scene.traverse(object=>{if(object instanceof THREE.Mesh){geometries.add(object.geometry);for(const m of Array.isArray(object.material)?object.material:[object.material]){materials.add(m);for(const value of Object.values(m))if(value instanceof THREE.Texture)textures.add(value);}}if(object instanceof THREE.SkinnedMesh)skeletons.add(object.skeleton);});
 geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>{t.dispose();const image=t.image as {close?:()=>void}|undefined;if(image&&typeof image.close==='function')image.close();});skeletons.forEach(s=>s.dispose());
}
export function normalizeScene(scene:THREE.Group){
 scene.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(scene),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
 if(box.isEmpty()||![...size,...center].every(Number.isFinite)||Math.max(...size)<=0)throw Error('Modelo sem geometria visível.');
 let triangles=0;scene.traverse(o=>{if(o instanceof THREE.Mesh)triangles+=(o.geometry.index?.count??o.geometry.attributes.position?.count??0)/3;});if(triangles>1000000)throw Error('Limite de um milhão de triângulos.');
 const root=new THREE.Group();scene.position.sub(center);root.add(scene);root.scale.setScalar(3/Math.max(...size));root.updateMatrixWorld(true);return root;
}
export async function readModel(buffer:ArrayBuffer){
 validateGLB(buffer);const manager=new THREE.LoadingManager();manager.setURLModifier(url=>{if(!/^(?:data:|blob:)/.test(url))throw Error('Recurso externo não permitido.');return url;});
 const gltf=await new GLTFLoader(manager).parseAsync(buffer,'');
 try{return normalizeScene(gltf.scene);}catch(error){disposeScene(gltf.scene);throw error;}
}
