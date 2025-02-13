export const formatCustomizations = (customisation_items) => {
    const customizations = customisation_items?.map((customization) => {
      const itemDetails = customization.item_details;
      const parentTag = itemDetails.tags.find((tag) => tag.code === "parent");
      const vegNonVegTag = itemDetails.tags.find((tag) => tag.code === "veg_nonveg");
      const isDefaultTag = parentTag.list.find((tag) => tag.code === "default");
      const isDefault = isDefaultTag?.value.toLowerCase() === "yes";
      const childTag = itemDetails.tags.find((tag) => tag.code === "child");
      const childs = childTag?.list.map((item) => item.value);
  
      return {
        id: itemDetails.id,
        name: itemDetails.descriptor.name,
        price: itemDetails.price.value,
        inStock: itemDetails.quantity.available.count > 0,
        parent: parentTag ? parentTag.list.find((tag) => tag.code === "id").value : null,
        child: childTag ? childTag.list.find((tag) => tag.code === "id").value : null,
        childs: childs?.length > 0 ? childs : null,
        isDefault: isDefault ?? false,
        vegNonVeg: vegNonVegTag ? vegNonVegTag.list[0].code : "",
      };
    });
    return customizations;
  };
  
  export const formatCustomizationGroups = (customisation_groups) => {
    const formattedCustomizationGroups = customisation_groups?.map((group) => {
      const configTags = group.tags.find((tag) => tag.code === "config").list;
      const minConfig = configTags.find((tag) => tag.code === "min").value;
      const maxConfig = configTags.find((tag) => tag.code === "max").value;
      const inputTypeConfig = configTags.find((tag) => tag.code === "input").value;
      const seqConfig = configTags.find((tag) => tag.code === "seq").value;
  
      const customizationObj = {
        id: group.local_id,
        name: group.descriptor.name,
        inputType: inputTypeConfig,
        minQuantity: parseInt(minConfig),
        maxQuantity: parseInt(maxConfig),
        seq: parseInt(seqConfig),
      };
  
      if (inputTypeConfig === "input") {
        customizationObj.special_instructions = "";
      }
  
      return customizationObj;
    });
  
    return formattedCustomizationGroups;
  };
  
  export const getCustomizationGroupsForProduct = (allGroups, ids) => {
    return allGroups.filter((g) => {
      return ids.includes(g.local_id);
    });
  };
  
  export const hasCustomizations = (productPayload) => {
    return productPayload.item_details.tags.find((item) => item.code === "custom_group") ? true : false;
    // return productPayload.item_details.tags.find(
    //   (item) => item.code === "custom_group"
    // )
    //   ? productPayload?.customisation_groups?.length > 0
    //   : false;
  };
  
  export const initializeCustomizationState_ = async (customizationGroups, customizations, customization_state) => {
    let firstGroup = null;
    for (const group of customizationGroups) {
      if (group.seq === 1) {
        firstGroup = group;
        break;
      }
    }
    if (firstGroup) {
      let currentGroup = firstGroup.id;
      let level = 1;
      const newState = { ...customization_state };
  
      while (currentGroup) {
        const group = customizationGroups.find((group) => group.id === currentGroup);
        if (group) {
          newState[level] = {
            id: group.id,
            seq: group.seq,
            name: group.name,
            inputType: group?.inputType,
            options: [],
            selected: [],
          };
          newState[level].options = customizations.filter((customization) => customization.parent === currentGroup);
  
          // Skip selecting an option for non-mandatory groups (minQuantity === 0)
          if (group.minQuantity === 1) {
            const selectedCustomization = newState[level].options.find((opt) => opt.isDefault && opt.inStock);
  
            // If no default option, select the first available option
            if (!selectedCustomization) {
              newState[level].selected = [newState[level].options.find((opt) => opt.inStock)];
            } else {
              newState[level].selected = [selectedCustomization];
            }
          }
  
          currentGroup = newState[level].selected[0]?.child || null;
          level++;
  
          // If a non-mandatory group is encountered, break the loop
          if (group.minQuantity === 0) {
            break;
          }
        } else {
          currentGroup = null;
        }
      }
  
      return newState;
    }
    return {};
  };
  
  export const createCustomizationAndGroupMapping = (customizations) => {
    let newCustomizationGroupMappings = {};
    let customizationToGroupMap = {};
    customizations.forEach((customization) => {
      const groupId = customization.parent;
      const childId = customization.id;
  
      customizationToGroupMap = {
        ...customizationToGroupMap,
        [customization.id]: customization.childs == undefined ? [] : customization.childs,
      };
  
      if (!newCustomizationGroupMappings[groupId]) {
        newCustomizationGroupMappings[groupId] = new Set();
      }
      newCustomizationGroupMappings[groupId].add(childId);
    });
  
    const finalizedCustomizationGroupMappings = {};
    for (const groupId in newCustomizationGroupMappings) {
      finalizedCustomizationGroupMappings[groupId] = Array.from(newCustomizationGroupMappings[groupId]);
    }
  
    return {
      customizationToGroupMap,
      groupToCustomizationMap: finalizedCustomizationGroupMappings,
    };
  };
  
  export function findMinMaxSeq(customizationGroups) {
    if (!customizationGroups || customizationGroups.length === 0) {
      return { minSeq: undefined, maxSeq: undefined };
    }
  
    let minSeq = Infinity;
    let maxSeq = -Infinity;
  
    customizationGroups.forEach((group) => {
      const seq = group.seq;
      if (seq < minSeq) {
        minSeq = seq;
      }
      if (seq > maxSeq) {
        maxSeq = seq;
      }
    });
  
    return { minSeq, maxSeq };
  }
  
  export const findSelectedCustomizationForGroup = (group, childCustomizations) => {
    if (!group.isMandatory) return [];
    let defaultCustomization = childCustomizations.filter(
      (customization) => customization.isDefault && customization.inStock
    );
  
    if (defaultCustomization.length) {
      return defaultCustomization;
    } else {
      return [childCustomizations.find((customization) => customization.inStock)];
    }
  };
  
// Modified version that considers selectedOptions
// export const initializeCustomizationState = async (
//     customizationGroups, 
//     customizations, 
//     customization_state,
//     selectedOptions = [] // Add this parameter
// ) => {
//     const mappings = createCustomizationAndGroupMapping(customizations);
//     const customizationToGroupMap = mappings.customizationToGroupMap;
//     const minSeq = findMinMaxSeq(customizationGroups).minSeq;
//     const firstGroup = customizationGroups.find((group) => group.seq === minSeq);
//     customization_state = { firstGroup };

//     const processGroup = (id) => {
//         const group = customizationGroups.find((item) => item.id === id);
//         const groupId = group.id;
        
//         // Get selected options for this group
//         const groupSelections = selectedOptions.filter(option => {
//             const customization = customizations.find(c => c.id === option.id);
//             return customization && customization.parent === groupId;
//         });

//         customization_state[groupId] = {
//             id: groupId,
//             name: group.name,
//             seq: group.seq,
//             options: [],
//             selected: groupSelections.length ? groupSelections : [], // Use selected options if available
//             childs: [],
//             isMandatory: group.minQuantity > 0,
//             type: group.maxQuantity > 1 ? "Checkbox" : "Radio",
//         };

//         const childCustomizations = customizations.filter(
//             (customization) => customization.parent === groupId
//         );

//         customization_state[groupId].options = childCustomizations;
        
//         // Only use findSelectedCustomizationForGroup if no selections exist
//         if (!customization_state[groupId].selected.length) {
//             customization_state[groupId].selected = findSelectedCustomizationForGroup(
//                 customization_state[groupId],
//                 childCustomizations
//             );
//         }

//         // Process child groups
//         let childGroups = customization_state[groupId].selected[0]?.id != undefined
//             ? customizationToGroupMap[customization_state[groupId].selected[0]?.id]
//             : [];
//         customization_state[groupId].childs = childGroups;

//         if (childGroups) {
//             for (const childGroup of childGroups) {
//                 processGroup(childGroup);
//             }
//         }
//     };

//     if (firstGroup) {
//         processGroup(firstGroup.id);
//         return customization_state;
//     }
// };
  

export const initializeCustomizationState = async (
    customizationGroups, 
    customizations, 
    customization_state,
    selectedOptions = []
) => {
    const mappings = createCustomizationAndGroupMapping(customizations);
    const customizationToGroupMap = mappings.customizationToGroupMap;
    const minSeq = findMinMaxSeq(customizationGroups).minSeq;
    const firstGroup = customizationGroups.find((group) => group.seq === minSeq);
    customization_state = { firstGroup };

    const processGroup = (id) => {
        const group = customizationGroups.find((item) => item.id === id);
        const groupId = group.id;
        
        // Get all customizations for this group
        const options = customizations.filter(
            (customization) => customization.parent === groupId
        );

        // Find selected options using IDs from selectedOptions
        const groupSelections = selectedOptions
            .filter(option => {
                const customization = customizations.find(c => c.id === option.id);
                return customization && customization.parent === groupId;
            })
            .map(option => {
                return options.find(opt => opt.id === option.id);
            })
            .filter(Boolean);

        customization_state[groupId] = {
            id: groupId,
            name: group.name,
            seq: group.seq,
            options,
            selected: groupSelections.length ? groupSelections : findSelectedCustomizationForGroup(
                { isMandatory: group.minQuantity > 0 },
                options
            ),
            childs: [],
            isMandatory: group.minQuantity > 0,
            type: group.maxQuantity > 1 ? "Checkbox" : "Checkbox",
        };

        // Process child groups based on selected options
        let childGroups = customization_state[groupId].selected[0]?.childs || [];
        customization_state[groupId].childs = childGroups;

        if (childGroups && childGroups.length > 0) {
            for (const childGroup of childGroups) {
                processGroup(childGroup);
            }
        }
    };

    if (firstGroup) {
        processGroup(firstGroup.id);
        return customization_state;
    }
};
  export function areCustomisationsSame(existingIds, currentIds) {
    if (existingIds.length !== currentIds.length) {
      return false;
    }
  
    existingIds.sort();
    currentIds.sort();
  
    for (let i = 0; i < existingIds.length; i++) {
      if (existingIds[i] !== currentIds[i]) {
        return false;
      }
    }
  
    return true;
  }