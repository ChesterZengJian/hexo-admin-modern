import * as React from "react";
import SimpleMDE from "react-simplemde-editor";

const Mdeditor = ({ id, source }) => {
  // const {
  //   input: { value, onChange },
  // } = useField(source);

  const imageUploadFunction = function (data, onSuccess, onError) {
    console.log(data instanceof File);
    console.log("imageUploadFunction");
    // hexoDataProvider.upload(data).then((data) => {
    //   console.log("data:");
    //   console.log(data);
    //   if (data.src) {
    //     data.src = data.src.replace(/\\/g, "/");
    //     data.src = data.src.substr(1, data.src.length - 1);
    //     console.log("Upload image successfully:" + data.src);
    //     onSuccess("/" + data.src);
    //   } else {
    //     onError(data);
    //   }
    // });
  };

  const extraKeys = () => {
    return {
      "Shift-Ctrl-`": function (cm) {
        var selection = cm.getSelection();
        cm.replaceSelection("`" + selection + "`");
        if (!selection) {
          var currentCursor = cm.getCursor();
          currentCursor.ch = currentCursor.ch - 1;
          cm.setCursor(currentCursor);
        }
      },
      "Shift-Ctrl-M": function (cm) {
        writeReadMoreTag(cm);
      }
    };
  };

  const toolbarOthers = {
    name: "others",
    className: "fa fa-ellipsis-v",
    title: "others buttons",
    children: ["guide"
      // {
      //   name: "image",
      //   action: "",
      //   className: "fa fa-picture-o",
      //   title: "Image",
      // },
    ]
  };

  const toolbarReadMore = {
    name: "read-more",
    action: (editor) => {
      var cm = editor.codemirror;
      writeReadMoreTag(cm);
    },
    className: "fa fa-audio-description",
    title: "read more(Shift-Ctrl-M)",
  };

  const shortcuts = {
    drawTable: "Ctrl-Alt-T",
    toggleBlockquote: "Shift-Ctrl-Q",
    toggleCodeBlock: "Shift-Ctrl-K",
    toggleUnorderedList: "Shift-Ctrl-[",
    toggleOrderedList: "Shift-Ctrl-]",
    drawImage: "Shift-Ctrl-I",
    toggleHeadingSmaller: "Ctrl--",
    toggleHeadingBigger: "Ctrl-=",
    toggleHeading1: "Ctrl-1",
    toggleHeading2: "Ctrl-2",
    toggleHeading3: "Ctrl-3"
  };

  const writeReadMoreTag = (cm) => {
    cm.replaceSelection("<!-- More -->");
  }

  return (
    <SimpleMDE
      // onChange={onChange}
      extraKeys={extraKeys()}
      options={{
        minHeight: "72vh",
        maxHeight: "72vh",
        autofocus: true,
        autosave: {
          enabled: true,
          uniqueId: id,
          delay: 300
        },
        // initialValue: value,
        uploadImage: true,
        imageUploadFunction: imageUploadFunction,
        shortcuts,
        spellChecker: false,
        showIcons: ["code", "table"],
        tabSize: 3,
        indentWithTabs: false,
        lineNumbers: false,
        lineWrapping: true,
        promptURLs: true,
        toolbar: [
          "bold", "italic", "heading", "|",
          "code", "quote", "unordered-list", "ordered-list", "|",
          "link", "image", "table", "|",
          "preview", "side-by-side", "fullscreen", "|",
          "horizontal-rule", toolbarReadMore, toolbarOthers
        ]
      }}
    />
  );
};

export default Mdeditor;