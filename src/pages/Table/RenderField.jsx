// import React, { useState } from "react";

// const RenderFieldValue = ({ field }) => {

//   const fieldInfo = (field, info) => {
//     if (field.type === "Map") {
//       return (
//         <li className="field_value_info">
//           {info.key}: {info.value} ({info.type})
//         </li>
//       );
//     } else if (field.type === "Array") {
//       return (
//         <li className="field_value_info">
//           {info.value} ({info.type})
//         </li>
//       );
//     } else {
//       return <span>{info.value}</span>;
//     }
//   };

//   if (field.type === "Array" || field.type === "Map") {
//     return (
//       <>
//         {field.valueInfo.map((info) => (
//           <div className="field_value_info_container" key={info.valueId}>
//             {fieldInfo(field, info)}
//             <div className="field_value_info_buttons">
//               <button
//                 className="edit_button"
//                 onClick={() => {
//                   editFieldValue(field.id, info);
//                 }}
//               >
//                 edit
//               </button>
//               <button
//                 className="delete_button"
//                 onClick={() => {
//                   deleteFieldValue(field.id, info.valueId);
//                 }}
//               >
//                 delete
//               </button>
//             </div>
//           </div>
//         ))}
//         <button
//           className="add_button"
//           onClick={() => {
//             // Add logic for adding a new value
//           }}
//         >
//           Add New
//         </button>
//       </>
//     );
//   } else {
//     return field.valueInfo.map((info) => (
//       <div className="field_value_info_container" key={info.valueId}>
//         {fieldInfo(field, info)}
//         <div className="field_value_info_buttons">
//           <button
//             className="edit_button"
//             onClick={() => {
//               editFieldValue(field.id, info);
//             }}
//           >
//             edit
//           </button>
//         </div>
//       </div>
//     ));
//   }
// };

// export default RenderFieldValue;
