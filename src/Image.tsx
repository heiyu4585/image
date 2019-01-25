import classnames from 'classnames';
import * as React from 'react';
import { polyfill } from 'react-lifecycles-compat';

import Preview from './Preview';
import Portal from './PreviewContainer';

import { ImageProps } from './PropTypes';
import { saveRef } from './util';

export interface ImageState {
  error?: boolean;
  preview?: boolean;
}

class Image extends React.Component<ImageProps, ImageState> {
;
  public static displayName = 'Image';
  public static defaultProps = {
    prefixCls: 'rc-image',
    errorSrc: 'error',
    preview: false,
    onLoad: () => null,
    onError: () => null,
  }
  public static getDerivedStateFromProps(nextProps: ImageProps, prevState: ImageState) {
    if ('preview' in prevState) { return null; }
    return {
      preview: nextProps.preview,
    }
  }  public saveImageRef: (ref: HTMLImageElement) => void;
  public imageRef: HTMLImageElement | null = null;
  constructor(props: ImageProps) {
    super(props);
    this.saveImageRef = saveRef(this, 'imageRef');
    this.state = {
      error: false,

    }
  }
  public onImageLoad = () => {
    const { onLoad } = this.props;
    if (onLoad) {
      onLoad();
    }
  }
  public onImageError = (err: React.SyntheticEvent) => {
    const { src, onError } = this.props;
    if (src) {
      this.setState({
        error: true,
      }, () => {
        if (onError) {
          onError();
        }
      })
    }
  }
  public handlePreview = (preview: boolean) => {
    this.setState({
      preview,
    })
  }
  public onImageClick = () => {
    this.handlePreview(true);
  }
  public render() {
    const {
      className,
      errorSrc,
      prefixCls,
      src,
      srcSet,
      alt,
      responsive,
      style,
      previewStyle,
      ...restProps
     } = this.props;
    const { error, preview } = this.state;
    const rootCls = {
      [className as string]: !!className,
      [prefixCls as string]: 1,
      [`${prefixCls}-responsive`]: !!responsive,
    };
    const imgSrc = error ? errorSrc : src;
    console.log('---imgSrc---', imgSrc);
    console.log('----state----', this.state);
    console.log('---this.props--', this.props);
    console.log('----ref--', this.imageRef);
    return (
      <React.Fragment>
        <img
          {...restProps}
          ref={this.saveImageRef}
          className={classnames(rootCls)}
          src={imgSrc}
          style={style}
          srcSet={srcSet}
          onLoad={this.onImageLoad}
          onError={this.onImageError}
          onClick={this.onImageClick}
          alt={alt}
        />
        {!error && preview && this.imageRef &&
          <Portal style={previewStyle}>
            <Preview
              prefixCls={prefixCls}
              handlePreview={this.handlePreview}
              cover={this.imageRef}
            />
          </Portal>
        }
      </React.Fragment>
    );
  }
}

polyfill(Image);

export default Image;
