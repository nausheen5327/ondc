import React, { useState, useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import { RadioGroup, FormControlLabel, Radio, Checkbox } from '@mui/material';

const CustomizationSection = ({ 
  group, 
  items,
  selectedOptions,
  onCustomizationChange,
  quantity 
}) => {
  const configTag = group.tags.find(tag => tag.code === "config");
  const config = configTag ? configTag.list.reduce((acc, item) => {
    acc[item.code] = item.value;
    return acc;
  }, {}) : {};

  // Auto-select first option if min=1 and nothing is selected for this group
  useEffect(() => {
    if (config.min === "1") {
      const currentGroupSelections = selectedOptions.filter(
        option => option.choiceIndex === parseInt(config.seq) - 1
      );
      
      if (currentGroupSelections.length === 0 && items?.length > 0) {
        const firstItem = items[0];
        const optionObj = {
          choiceIndex: parseInt(config.seq) - 1,
          ...firstItem.item_details,
          optionIndex: 0,
          isSelected: true,
          type: config.min === "1" ? 'required' : 'optional'
        };

        // Trigger auto-selection
        onCustomizationChange(
          config.input === "select" && config.max === "1",
          optionObj,
          optionObj.choiceIndex,
          optionObj.optionIndex,
          config.min === "1",
          config.max === "1" ? 'single' : 'multi',
          true
        );
      }
    }
  }, [config.min, config.seq, items, selectedOptions]);

  const handleChange = (event, item) => {
    const isChecked = event.target.checked;
    const currentGroupSelections = selectedOptions.filter(
      option => option.choiceIndex === parseInt(config.seq) - 1
    );

    // Prevent unselecting if this is the only selection and min is 1
    if (!isChecked && config.min === "1" && currentGroupSelections.length === 1 && 
        currentGroupSelections[0].id === item.item_details.id) {
      return;
    }

    // Check if selecting would exceed max selections for multi-select
    if (isChecked && config.max !== "1" && 
        currentGroupSelections.length >= parseInt(config.max)) {
      return;
    }

    const optionObj = {
      choiceIndex: parseInt(config.seq) - 1,
      ...item.item_details,
      optionIndex: items?.indexOf(item),
      isSelected: true,
      type: config.min === "1" ? 'required' : 'optional'
    };

    onCustomizationChange(
      config.input === "select" && config.max === "1",
      optionObj,
      optionObj.choiceIndex,
      optionObj.optionIndex,
      config.min === "1",
      config.max === "1" ? 'single' : 'multi',
      isChecked
    );
  };

  const isSelected = (item) => {
    return selectedOptions.some(option => 
      option.choiceIndex === parseInt(config.seq) - 1 && 
      option.id === item.item_details.id
    );
  };

  const isDisabled = (item) => {
    const currentGroupSelections = selectedOptions.filter(
      option => option.choiceIndex === parseInt(config.seq) - 1
    );
    
    // Disable unselecting if this is the only selection and min is 1
    if (config.min === "1" && 
        currentGroupSelections.length === 1 && 
        currentGroupSelections[0].id === item.item_details.id) {
      return true;
    }

    // Disable selection if max selections reached (for multi-select)
    if (config.max !== "1" && 
        !isSelected(item) && 
        currentGroupSelections.length >= parseInt(config.max)) {
      return true;
    }

    return false;
  };

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle1" fontWeight={500}>
        {group.descriptor.name}
        {config.min === "1" && <span style={{color: 'red'}}> *</span>}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {config.min === config.max 
          ? `Select ${config.min} option` 
          : `Select ${config.min} to ${config.max} options`}
      </Typography>
      
      {config.max === "1" ? (
        <RadioGroup>
          {items?.map((item, index) => (
            <FormControlLabel
              key={item.id}
              value={item.id}
              control={<Radio 
                checked={isSelected(item)}
                onChange={(e) => handleChange(e, item)}
                disabled={isDisabled(item)}
              />}
              label={
                <Stack direction="row" justifyContent="space-between" width="100%">
                  <Typography>{item.item_details.descriptor.name}</Typography>
                  {item.item_details.price.value > 0 && (
                    <Typography>+₹{item.item_details.price.value}</Typography>
                  )}
                </Stack>
              }
            />
          ))}
        </RadioGroup>
      ) : (
        <Stack>
          {items?.map((item, index) => (
            <FormControlLabel
              key={item.id}
              control={
                <Checkbox
                  checked={isSelected(item)}
                  onChange={(e) => handleChange(e, item)}
                  disabled={isDisabled(item)}
                />
              }
              label={
                <Stack direction="row" justifyContent="space-between" width="100%">
                  <Typography>{item.item_details.descriptor.name}</Typography>
                  {item.item_details.price.value > 0 && (
                    <Typography>+₹{item.item_details.price.value}</Typography>
                  )}
                </Stack>
              }
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default CustomizationSection;