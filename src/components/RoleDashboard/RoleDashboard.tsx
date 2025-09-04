import { faCirclePlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

type Child = { url: string; description: string };
type ListChilds = { [key: string]: Child };

function RoleDashboard() {
  const [listChilds, setListChilds] = useState<ListChilds>({
    child1: { url: "", description: "" },
  });

  useEffect(() => {
    Object.entries(listChilds).forEach(([key, value]) => {
      if (
        !value.url &&
        !value.description &&
        Object.keys(listChilds).length > 1
      ) {
        delete listChilds[key];
      } else if (
        (value.url || value.description) &&
        Object.keys(listChilds).length === 1
      ) {
        let _listChilds = _.cloneDeep(listChilds);
        _listChilds[`child${uuidv4()}`] = { url: "", description: "" };
        setListChilds(_listChilds);
      }
    });
  }, [listChilds]);

  const handleOnchangeChild = (
    name: keyof Child,
    value: string,
    key: string
  ) => {
    let _listChilds = _.cloneDeep(listChilds);
    _listChilds[key][name] = value;
    setListChilds(_listChilds);
  };

  const handleAddNewInput = () => {
    let _listChilds = _.cloneDeep(listChilds);
    _listChilds[`child${uuidv4()}`] = { url: "", description: "" };
    setListChilds(_listChilds);
  };

  const handleDeleteInput = (key: string) => {
    if (Object.keys(listChilds).length <= 1) return;
    let _listChilds = _.cloneDeep(listChilds);
    delete _listChilds[key];
    setListChilds(_listChilds);
  };

  const handleSaveChanges = () => {
    console.log(">>> check listChilds: ", listChilds);
    let invalidObject = Object.entries(listChilds).find(([, value]) => {
      return value && !value.url;
    });

    if (invalidObject) {
      // call api
    }
  };

  return (
    <div className="role-container">
      <div className="container">
        <div className="mt-3">
          <div className="title-role">
            <h4>Add a new role...</h4>
          </div>
          <div className="role-parent">
            {Object.entries(listChilds).map(([key, child]) => (
              <div
                className={`row role-child mb-3 ${key}`}
                key={`child-${key}`}
              >
                <div className="col-5 form-group">
                  <span>URL:</span>
                  <input
                    className="form-control"
                    type="text"
                    value={child.url}
                    onChange={(e) =>
                      handleOnchangeChild("url", e.target.value, key)
                    }
                  />
                </div>
                <div className="col-5 form-group">
                  <span>Description:</span>
                  <input
                    className="form-control"
                    type="text"
                    value={child.description}
                    onChange={(e) =>
                      handleOnchangeChild("description", e.target.value, key)
                    }
                  />
                </div>
                <div className="col-2 form-group d-flex align-items-end">
                  <button
                    className="btn btn-success"
                    onClick={handleAddNewInput}
                  >
                    <FontAwesomeIcon icon={faCirclePlus} className="me-0" />
                  </button>
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => handleDeleteInput(key)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-0" />
                  </button>
                </div>
              </div>
            ))}

            <div className="">
              <button className="btn btn-warning mt-3" onClick={handleSaveChanges}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleDashboard;
