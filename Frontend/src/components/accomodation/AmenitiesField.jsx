import React from "react";

const initialamenities = [
  { id: "wifi", name: "wifi", label: "Wifi", icon: "wifi" },
  {
    id: "kitchen",
    name: "kitchen",
    label: "Kitchen",
    icon: "kitchen",
  },
  {
    id: "parking",
    name: "Free parking",
    label: "Free Parking",
    icon: "garage_home",
  },
  {
    id: "washingmachine",
    name: "washing machine",
    label: "Washing Machine",
    icon: "local_laundry_service",
  },
  { id: "tv", name: "Tv", label: "Tv", icon: "tv" },
  { id: "pool", name: "Pool", label: "Pool", icon: "pool" },
  { id: "ac", name: "Ac", label: "Ac", icon: "air" },
];

const AmenitiesField = ({ form: formApi }) => {
  const Field = formApi.Field;

  return (
    <div className="perks-container">
      <h4 className="perks-header">Amenities</h4>
      <p className="form-paras">Select perks</p>

      <Field name="amenities">
        {(field) => (
          <div className="perks row">
            {initialamenities.map((amenity) => (
              <div
                key={amenity.id}
                className={`${amenity.id}-box checkbox-container col-sm-12 col-md-3 col-lg-2`}
              >
                <input
                  type="checkbox"
                  checked={field.state.value.some(
                    (item) => item.name === amenity.name
                  )}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    const currentAmenities = field.state.value || [];

                    if (isChecked) {
                      field.handleChange([
                        ...currentAmenities,
                        { name: amenity.name, icon: amenity.icon },
                      ]);
                    } else {
                      field.handleChange(
                        currentAmenities.filter(
                        (item) => item.name !== amenity.name
                        )
                      );
                    }
                  }}
                />
                <span className="material-symbols-outlined">
                  {amenity.icon}
                </span>
                <span>{amenity.label}</span>
              </div>
            ))}
          </div>
        )}
      </Field>
    </div>
  );
};

export default AmenitiesField;
