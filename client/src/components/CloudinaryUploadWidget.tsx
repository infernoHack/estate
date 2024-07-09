import {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  CSSProperties,
  ReactElement,
  cloneElement,
} from "react";

interface CloudinaryUploadWidgetProps {
  uwConfig: {
    cloudName: string;
    uploadPreset: string;
    multiple: boolean;
    [key: string]: unknown;
  };
  buttonText: string;
  buttonStyles?: CSSProperties;
  setState?: Dispatch<
    SetStateAction<
      {
        filename: string;
        url: string;
        public_id: string;
      }[]
    >
  >;
  renderElement?: ReactElement;
  disabled?: boolean;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        config: object,
        callback: (
          error: { message: string } | null,
          result: {
            event: string;
            info: {
              public_id: string;
              url: string;
              original_filename: string;
            };
          },
        ) => void,
      ) => { open: () => void };
    };
  }
}

function CloudinaryUploadWidget({
  uwConfig,
  buttonText,
  buttonStyles,
  setState,
  renderElement,
  disabled,
}: CloudinaryUploadWidgetProps) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const widgetRef = useRef<{ open: () => void } | null>(null);

  useEffect(() => {
    const loadCloudinaryScript = () => {
      if (!window.cloudinary) {
        const script = document.createElement("script");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.id = "uw";
        script.async = true;
        script.onload = () => setLoaded(true);
        document.body.appendChild(script);
      } else {
        setLoaded(true);
      }
    };

    loadCloudinaryScript();
  }, []);

  useEffect(() => {
    if (loaded && window.cloudinary && !widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result && result.event === "success") {
            if (setState) {
              setState((state) => [
                ...(uwConfig.multiple ? state : []),
                {
                  filename: result.info.original_filename,
                  url: result.info.url,
                  public_id: result.info.public_id,
                },
              ]);
            }
          } else if (error) {
            console.error("Error uploading image:", error);
          }
        },
      );
    }
  }, [loaded, uwConfig, setState]);

  const handleClick = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  const style: CSSProperties = buttonStyles ?? {};

  return (
    <>
      {renderElement && cloneElement(renderElement, { onClick: handleClick })}
      <button
        type="button"
        id="upload_widget"
        className="cloudinary-button"
        onClick={handleClick}
        style={style}
        disabled={disabled}
      >
        {buttonText}
      </button>
    </>
  );
}

export default CloudinaryUploadWidget;
