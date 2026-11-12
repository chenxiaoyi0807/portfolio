/** Keep the DOM copy synchronous with the click for embedded browser support. */
export async function copyText(text:string):Promise<void>{
  const previous=document.activeElement as HTMLElement|null;
  const selection=window.getSelection();
  const ranges=selection?Array.from({length:selection.rangeCount},(_,i)=>selection.getRangeAt(i).cloneRange()):[];
  const field=document.createElement('textarea');
  field.value=text;
  field.readOnly=true;
  field.tabIndex=-1;
  field.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;pointer-events:none';
  document.body.appendChild(field);
  let copied=false;
  try{
    field.focus({preventScroll:true});
    field.select();
    field.setSelectionRange(0,text.length);
    copied=document.execCommand('copy');
  }catch{
    copied=false;
  }finally{
    field.remove();
    previous?.focus({preventScroll:true});
    if(selection){selection.removeAllRanges();ranges.forEach(range=>selection.addRange(range))}
  }
  if(copied)return;
  if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
  await navigator.clipboard.writeText(text);
}
