const router = require('express').Router();
const sequelize = require('../../config/connection');

// The `/api/tags` endpoint
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  // find all tags
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }, { model: ProductTag }],
      attributes: {
        include: [
          [
            // be sure to include its associated Product data
            sequelize.literal(
              '(CREATE VIEW [Tags] AS SELECT tag_name, product_name FROM Product, product_id FROM ProductTag, tag_id FROM ProductTag)'
            ),
            'Tags & Product Data',
          ],
        ],
      },
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {

  // find a single tag by its `id`
  try{
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }, { model: ProductTag }],
      attributes: {
        include: [
          [
            // be sure to include its associated Product data
            sequelize.literal(
              '(CREATE VIEW [Tags] AS SELECT tag_name, product_name FROM Product, product_id FROM ProductTag, tag_id FROM ProductTag)'
            ),
            'Tags & Product Data',
          ],
        ],
      },
    });
    res.status(200).json(tagData);
  } catch (err) {
  res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  const tagData = await Tag.create(req.body);

  return res.json(bookData);
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  const tagData = await Tag.update(
    {
      tag_name: req.body.tag_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );

  return res.json(tagData);
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  const tagData = await Tag.destroy({
    where: {
      id: req.params.id,
    },
  });

  return res.json(tagData);
});

module.exports = router;
