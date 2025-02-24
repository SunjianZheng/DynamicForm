import React, { FC, useState, useEffect } from 'react';
import { ImagePicker, Toast } from 'antd-mobile-v2';
import { ImageFile, ImagePickerGroupProps } from './interface';
import { transformFile } from '../../utils';

const ImagePickerGroup: FC<ImagePickerGroupProps> = (props) => {
  const {
    onChange,
    limitSize,
    compressRatio,
    value = [],
    maxLength,
    ...otherProps
  } = props;

  const [selectable, setSelectable] = useState<boolean>(true);

  useEffect(() => {
    if (maxLength && value && value.length && value.length >= maxLength) {
      setSelectable(false);
    } else {
      setSelectable(true);
    }
  }, [JSON.stringify(value || [])]);

  const checkFileLimit = (file: ImageFile) => {
    if (limitSize && file && file.size && file.size > limitSize) {
      Toast.fail('图片过大', 1);
      return false;
    }
    return true;
  };

  const imageChange = (
    files: ImageFile[] | any,
    operationType: string,
    index: number | undefined,
  ) => {
    if (files && files.length > value.length) {
      const lastFile = files[files.length - 1];
      const { file = {} } = lastFile;
      if (compressRatio && lastFile.url.indexOf('base64,') !== -1) {
        transformFile(lastFile.file, compressRatio).then((newFile: any) => {
          const reader = new FileReader();
          reader.readAsDataURL(newFile);
          reader.onload = function ({ target }) {
            if (!checkFileLimit(newFile)) return;
            files[files.length - 1] = {
              ...files[files.length - 1],
              file: newFile,
              url: target?.result || '',
            };
          };
        });
      } else if (!checkFileLimit(file)) return;
    }
    onChange(files, operationType, index);
  };
  return (
    <ImagePicker
      selectable={selectable}
      {...otherProps}
      onChange={imageChange}
      files={value}
    />
  );
};

export default ImagePickerGroup;
