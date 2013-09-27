using System;
using System.ComponentModel;

namespace EventFeedback.Common
{
    public static partial class Extensions
    {
        public static string GetEnumDescription(this Enum value)
        {
            if (value != null)
            {
                var type = value.GetType();
                var name = Enum.GetName(type, value);
                if (name != null)
                {
                    var field = type.GetField(name);
                    if (field != null)
                    {
                        var attr = Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute)) as DescriptionAttribute;
                        if (attr != null)
                        {
                            return attr.Description;
                        }
                    }
                }
            }
            return null;
        }
    }
}
